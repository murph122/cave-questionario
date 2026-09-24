/**
 * CAVE Questionario → Google Sheets (two separate files)
 *
 * 1) BOOKINGS spreadsheet — only appointment rows (tab "Bookings")
 * 2) RESPONSES spreadsheet — questionnaire rows (tab "Form_Responses")
 *
 * Create a new Google Sheet for bookings, share it with the same Google
 * account that owns this Apps Script, paste its ID below, then redeploy.
 *
 * Deploy: paste this file → Deploy as Web app (Anyone)
 * Then set SHEETS_WEBHOOK_URL in .env / Vercel
 */

var BOOKINGS_SHEET = 'Bookings'
var RESPONSES_SHEET = 'Form_Responses'

/** Questionnaire / form answers — keep your existing sheet */
var RESPONSES_SPREADSHEET_ID = '1lULR-CpicCsOZQT7BqidPj6tO10IqpnHde_MMaFF1oQ'

/** Bookings only — separate spreadsheet from questionnaire responses */
var BOOKINGS_SPREADSHEET_ID = '1WJW8_xIeYwHmJ4uANl3e1vIz04ONmAPTCsvBHn0jt0g'

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'ping'
    if (action === 'ping') {
      return json_({
        ok: true,
        service: 'cave-questionario-sheets',
        bookingsSheet: bookingsSs_().getName(),
        responsesSheet: responsesSs_().getName(),
        bookings: listBookings_().length,
        bookingsIdSet: !!BOOKINGS_SPREADSHEET_ID,
      })
    }
    if (action === 'listBookings') {
      return json_({ ok: true, taken: takenKeys_(), bookings: listBookings_() })
    }
    if (action === 'getBooking') {
      var code = String((e.parameter && e.parameter.code) || '').toUpperCase().trim()
      var b = findBooking_(code)
      if (!b) return json_({ ok: false, error: 'not_found' })
      return json_({ ok: true, booking: b })
    }
    return json_({ ok: false, error: 'unknown_action' })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}'
    var data = JSON.parse(raw)
    var type = data.type || 'survey'

    if (type === 'listBookings') {
      ensureBookingsHeader_()
      return json_({ ok: true, taken: takenKeys_(), bookings: listBookings_() })
    }

    if (type === 'booking') {
      ensureBookingsHeader_()
      var sheet = bookingsSheet_()
      var key = String(data.date) + '|' + String(data.slotId)
      if (takenKeys_().indexOf(key) !== -1) {
        return json_({ ok: false, error: 'slot_taken' })
      }
      // Save first — never block the HTTP response on email
      sheet.appendRow([
        new Date(),
        data.bookingId || '',
        String(data.participantCode || '').toUpperCase(),
        data.date || '',
        data.slotId || '',
        data.contactName || '',
        data.email || '',
        data.phone || '',
        data.note || '',
        'pending',
      ])
      return json_({ ok: true, status: 'pending', emailSent: false, emailDeferred: true })
    }

    if (type === 'sendBookingEmail') {
      var mailResult = sendBookingEmail_(data)
      return json_({ ok: true, emailSent: mailResult.sent, emailError: mailResult.error || null })
    }

    if (type === 'approve') {
      var codeA = String(data.participantCode || '').toUpperCase().trim()
      var status = data.status || 'approved'
      if (!codeA) return json_({ ok: false, error: 'missing_code' })
      var updated = setBookingStatus_(codeA, status, data.date, data.slotId)
      if (!updated) {
        // Only create a row for manual approve — never invent a cancel/revoke row
        if (status === 'cancelled' || status === 'pending') {
          return json_({ ok: false, error: 'not_found' })
        }
        ensureBookingsHeader_()
        bookingsSheet_().appendRow([
          new Date(),
          data.bookingId || Utilities.getUuid(),
          codeA,
          normalizeDate_(data.date || ''),
          normalizeSlot_(data.slotId || ''),
          data.contactName || 'manual',
          data.email || '',
          data.phone || '',
          data.note || 'approved-from-admin',
          status,
        ])
        return json_({ ok: true, status: status, created: true })
      }
      return json_({ ok: true, status: status, created: false })
    }

    if (type === 'ping') {
      return json_({
        ok: true,
        service: 'cave-questionario-sheets',
        bookingsSheet: bookingsSs_().getName(),
        responsesSheet: responsesSs_().getName(),
        bookings: listBookings_().length,
        bookingsIdSet: !!BOOKINGS_SPREADSHEET_ID,
      })
    }

    if (type === 'google_sheet' || type === 'survey') {
      var payload = data.data || data
      ensureResponsesHeader_()
      responsesSheet_().appendRow(responseRow_(payload))
      var codeDone = String(
        (payload.participantCode ||
          (payload.anagrafica && payload.anagrafica.codicePersonale) ||
          ''),
      ).toUpperCase()
      if (codeDone) setBookingStatus_(codeDone, 'done')
      return json_({ ok: true })
    }

    return json_({ ok: false, error: 'unknown_type' })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}

function bookingsSs_() {
  if (!BOOKINGS_SPREADSHEET_ID) {
    throw new Error(
      'BOOKINGS_SPREADSHEET_ID is empty — create a bookings Google Sheet and paste its ID in Code.gs',
    )
  }
  return SpreadsheetApp.openById(BOOKINGS_SPREADSHEET_ID)
}

function responsesSs_() {
  return SpreadsheetApp.openById(RESPONSES_SPREADSHEET_ID)
}

function bookingsSheet_() {
  var ss = bookingsSs_()
  var sheet = ss.getSheetByName(BOOKINGS_SHEET)
  if (!sheet) sheet = ss.insertSheet(BOOKINGS_SHEET)
  return sheet
}

function responsesSheet_() {
  var ss = responsesSs_()
  var sheet = ss.getSheetByName(RESPONSES_SHEET)
  if (!sheet) sheet = ss.getSheets()[0]
  return sheet
}

function ensureBookingsHeader_() {
  var sheet = bookingsSheet_()
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'timestamp',
      'bookingId',
      'participantCode',
      'date',
      'slotId',
      'contactName',
      'email',
      'phone',
      'note',
      'status',
    ])
  }
}

function ensureResponsesHeader_() {
  var sheet = responsesSheet_()
  if (sheet.getLastRow() === 0) sheet.appendRow(responseHeader_())
}

function normalizeDate_(v) {
  if (Object.prototype.toString.call(v) === '[object Date]' && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, Session.getScriptTimeZone() || 'Europe/Rome', 'yyyy-MM-dd')
  }
  var s = String(v == null ? '' : v).trim()
  var m = s.match(/(\d{4}-\d{2}-\d{2})/)
  if (m) return m[1]
  return s
}

function normalizeSlot_(v) {
  return String(v == null ? '' : v).trim()
}

function listBookings_() {
  ensureBookingsHeader_()
  var sheet = bookingsSheet_()
  var values = sheet.getDataRange().getValues()
  var out = []
  for (var i = 1; i < values.length; i++) {
    var r = values[i]
    if (!r[2]) continue
    out.push({
      timestamp: r[0],
      bookingId: r[1],
      participantCode: String(r[2]).toUpperCase().trim(),
      date: normalizeDate_(r[3]),
      slotId: normalizeSlot_(r[4]),
      contactName: r[5],
      email: r[6],
      phone: r[7],
      note: r[8],
      status: String(r[9] || 'pending').toLowerCase().trim(),
      row: i + 1,
    })
  }
  return out
}

function takenKeys_() {
  // Only approved (or completed) bookings lock the slot for others.
  // Pending requests stay bookable until the experimenter confirms.
  return listBookings_()
    .filter(function (b) {
      return b.status === 'approved' || b.status === 'done'
    })
    .map(function (b) {
      return b.date + '|' + b.slotId
    })
}

function findBooking_(code) {
  var list = listBookings_()
  for (var i = list.length - 1; i >= 0; i--) {
    if (list[i].participantCode === code) return list[i]
  }
  return null
}

/**
 * Update status. Prefer matching code + date + slotId so duplicate name-codes
 * (same person booking twice, or shared codes) update the correct row.
 */
function setBookingStatus_(code, status, date, slotId) {
  ensureBookingsHeader_()
  var sheet = bookingsSheet_()
  var values = sheet.getDataRange().getValues()
  var wantDate = date ? normalizeDate_(date) : ''
  var wantSlot = slotId ? normalizeSlot_(slotId) : ''
  var codeU = String(code || '')
    .toUpperCase()
    .trim()

  for (var i = values.length - 1; i >= 1; i--) {
    if (String(values[i][2]).toUpperCase().trim() !== codeU) continue
    if (wantDate && normalizeDate_(values[i][3]) !== wantDate) continue
    if (wantSlot && normalizeSlot_(values[i][4]) !== wantSlot) continue
    sheet.getRange(i + 1, 10).setValue(status)
    return true
  }
  return false
}

/** Edit this address shown in confirmation emails. */
var LAB_LOCATION = 'Laboratorio CAVE / 3D Lab — Politecnico (aggiorna indirizzo in Code.gs)'

var SLOT_LABELS = {
  S1: '10:00 – 11:30',
  S2: '13:00 – 14:30',
  S3: '14:30 – 16:00',
  S4: '16:00 – 17:30',
}

function sendBookingEmail_(data) {
  var to = String(data.email || '').trim()
  if (!to || to.indexOf('@') === -1) {
    return { sent: false, error: 'no_email' }
  }
  var code = String(data.participantCode || '').toUpperCase()
  var slot = SLOT_LABELS[data.slotId] || data.slotId || ''
  var location = data.location || LAB_LOCATION
  var siteUrl = data.siteUrl || ''
  var subject = 'Conferma prenotazione CAVE — ' + code
  var body =
    'Ciao ' +
    (data.contactName || '') +
    ',\n\n' +
    'La tua prenotazione per l’esperimento CAVE è stata registrata.\n\n' +
    '• Codice univoco: ' +
    code +
    '\n' +
    '• Data: ' +
    (data.date || '') +
    '\n' +
    '• Orario: ' +
    slot +
    '\n' +
    '• Luogo: ' +
    location +
    '\n\n' +
    'Stato: in attesa di approvazione dello sperimentatore.\n' +
    'Quando sarà approvata, entra nel questionario con il codice sopra' +
    (siteUrl ? ':\n' + siteUrl.replace(/\/$/, '') + '/accedi\n' : '.\n') +
    '\n' +
    'Conserva questa email.\n\n' +
    '— CAVE Lab\n'

  try {
    MailApp.sendEmail({
      to: to,
      subject: subject,
      body: body,
    })
    return { sent: true }
  } catch (err) {
    return { sent: false, error: String(err) }
  }
}

function responseHeader_() {
  return [
    '时间戳记',
    'Nome',
    'Cognome',
    'Codice',
    'Età',
    'Condizioni',
    'PSS1',
    'PSS2',
    'PSS3',
    'PSS4',
    'PSS5',
    'PSS6',
    'PSS7',
    'PSS8',
    'PSS9',
    'PSS10',
    // stressante
    'ST_SAM1',
    'ST_SAM2',
    'ST_SAM3',
    'ST_IEQ1',
    'ST_IEQ2',
    'ST_IEQ3',
    'ST_IEQ4',
    'ST_IEQ5',
    'ST_IEQ6',
    'ST_IEQ7',
    'ST_IEQ8',
    'ST_IEQ9',
    'ST_IEQ10',
    'ST_IEQ11',
    'ST_IEQ12',
    'ST_IPQ1',
    'ST_IPQ2',
    'ST_IPQ3',
    'ST_IPQ4',
    'ST_IPQ5',
    'ST_IPQ6',
    'ST_IPQ7',
    'ST_IPQ8',
    'ST_IPQ9',
    'ST_IPQ10',
    'ST_IPQ11',
    'ST_IPQ12',
    'ST_IPQ13',
    'ST_IPQ14',
    'ST_SSSQ1',
    'ST_SSSQ2',
    'ST_SSSQ3',
    'ST_SSSQ4',
    // non_stressante
    'NS_SAM1',
    'NS_SAM2',
    'NS_SAM3',
    'NS_IEQ1',
    'NS_IEQ2',
    'NS_IEQ3',
    'NS_IEQ4',
    'NS_IEQ5',
    'NS_IEQ6',
    'NS_IEQ7',
    'NS_IEQ8',
    'NS_IEQ9',
    'NS_IEQ10',
    'NS_IEQ11',
    'NS_IEQ12',
    'NS_IPQ1',
    'NS_IPQ2',
    'NS_IPQ3',
    'NS_IPQ4',
    'NS_IPQ5',
    'NS_IPQ6',
    'NS_IPQ7',
    'NS_IPQ8',
    'NS_IPQ9',
    'NS_IPQ10',
    'NS_IPQ11',
    'NS_IPQ12',
    'NS_IPQ13',
    'NS_IPQ14',
    'NS_SSSQ1',
    'NS_SSSQ2',
    'NS_SSSQ3',
    'NS_SSSQ4',
    'SSQ1',
    'SSQ2',
    'SSQ3',
    'SSQ4',
    'SSQ5',
    'SSQ6',
    'SSQ7',
    'SSQ8',
    'SSQ9',
    'SSQ10',
    'SSQ11',
    'SSQ12',
    'SSQ13',
    'SSQ14',
    'SSQ15',
    'SSQ16',
    'SSQ17',
    'SUS1',
    'SUS2',
    'SUS3',
    'SUS4',
    'SUS5',
    'SUS6',
    'SUS7',
    'SUS8',
    'SUS9',
    'SUS10',
  ]
}

function sessionVals_(answers) {
  var s = answers || {}
  return [
    s.SAM1_Arousal,
    s.SAM2_Valence,
    s.SAM3_Dominance,
    s['IEQ-SF1'],
    s['IEQ-SF2'],
    s['IEQ-SF3'],
    s['IEQ-SF4'],
    s['IEQ-SF5'],
    s['IEQ-SF6'],
    s['IEQ-SF7'],
    s['IEQ-SF8'],
    s['IEQ-SF9'],
    s['IEQ-SF10'],
    s['IEQ-SF11'],
    s['IEQ-SF12'],
    s.IPQ1_G1,
    s.IPQ2_SP1,
    s.IPQ3_SP2,
    s.IPQ4_SP3,
    s.IPQ5_SP4,
    s.IPQ6_SP5,
    s.IPQ7_INV1,
    s.IPQ8_INV2,
    s.IPQ9_INV3,
    s.IPQ10_INV4,
    s.IPQ11_REAL1,
    s.IPQ12_REAL2,
    s.IPQ13_REAL3,
    s.IPQ14_REAL4,
    s.SSSQ1,
    s.SSSQ2,
    s.SSSQ3,
    s.SSSQ4,
  ]
}

function responseRow_(data) {
  var a = data.anagrafica || {}
  var p = data.pss || {}
  var sessions = data.sessions || {}
  var st = (sessions.stressante && sessions.stressante.answers) || {}
  var ns = (sessions.non_stressante && sessions.non_stressante.answers) || {}
  // backward compat single session
  if ((!Object.keys(st).length || !Object.keys(ns).length) && data.session) {
    if (data.session.condition === 'stressante') st = data.session.answers || st
    if (data.session.condition === 'non_stressante') ns = data.session.answers || ns
  }
  var f = (data.final && data.final.answers) || {}
  var condizioni = 'stressante+non_stressante'

  return [new Date(), a.nome || '', a.cognome || '', a.codicePersonale || data.participantCode || '', a.eta || '', condizioni]
    .concat([
      p.PSS1,
      p.PSS2,
      p.PSS3,
      p.PSS4,
      p.PSS5,
      p.PSS6,
      p.PSS7,
      p.PSS8,
      p.PSS9,
      p.PSS10,
    ])
    .concat(sessionVals_(st))
    .concat(sessionVals_(ns))
    .concat([
      f.SSQ1,
      f.SSQ2,
      f.SSQ3,
      f.SSQ4,
      f.SSQ5,
      f.SSQ6,
      f.SSQ7,
      f.SSQ8,
      f.SSQ9,
      f.SSQ10,
      f.SSQ11,
      f.SSQ12,
      f.SSQ13,
      f.SSQ14,
      f.SSQ15,
      f.SSQ16,
      (data.final && data.final.ssqAltro) || '',
      f.SUS1,
      f.SUS2,
      f.SUS3,
      f.SUS4,
      f.SUS5,
      f.SUS6,
      f.SUS7,
      f.SUS8,
      f.SUS9,
      f.SUS10,
    ])
}
