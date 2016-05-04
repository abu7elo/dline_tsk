var express = require('express');
var router  = express.Router();
var controller = require("../controllers/mainController");

router.get('/all/stats',controller.allState);
router.get('/:airport/stats',controller.airportState);
router.get('/:airport/reviews',controller.airportReviews);
router.get('/update_data',controller.updateData);
module.exports = router;