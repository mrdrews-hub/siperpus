const router = require('express').Router()
const ReportController = require('./report.controller')

router.post('/borrow', ReportController.getReportPeminjaman)
router.post('/books', ReportController.getReportBuku)
router.post('/member', ReportController.getReportMember)
router.get('/penalty', ReportController.getReportPelanggaran)

module.exports = router