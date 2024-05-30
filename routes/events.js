const { check } = require("express-validator");
const {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
} = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");
const router = require("express").Router();

router.use(validarJWT);

router.get("/", getEvents);
router.post(
  "/",
  [
    check("title", "Title is required").not().isEmpty(),
    check("start", "Start date is required").custom(isDate),
    check("end", "End date is required").custom(isDate),
    validarCampos,
  ],

  createEvents
);
router.put("/:id", updateEvents);
router.delete("/:id", deleteEvents);

module.exports = router;
