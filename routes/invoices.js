const db = require("../db");

const express = require("express");
const router = express.Router();
const ExpressError = require("../expressError");
const e = require("express");

router.get("/", async (req, res, next) => {
  try {
    const results = await db.query("SELECT * FROM invoices");
    res.json({ invoices: results.rows });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query("SELECT * FROM invoices WHERE id=$1", [id]);
    if (results.rows.length === 0) {
      throw new ExpressError(`There is no company with an id of ${id}`);
    } else {
      res.json({ invoice: results.rows });
    }
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { comp_code, amt } = req.body;
    const results = await db.query(
      "INSERT INTO invoices (comp_code, amt) VALUES($1, $2) RETURNING *",
      [comp_code, amt]
    );
    res.json(results.rows);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amt } = req.body;
    const results = await db.query(
      "UPDATE companies SET amt=$1 WHERE id= $2 RETURNING *",
      [amt, id]
    );

    if (results.rows.length === 0) {
      throw new ExpressError(`There is no company with an id of ${id}`);
    } else {
      return res.json({ invoice: results.rows });
    }
  } catch (e) {
    return next(e);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await db.query("DELETE FROM invoices WHERE id=$1 RETURNING *", [id]);

    if (results.rows.length === 0) {
      throw new ExpressError(`There is no company with an id pf ${id}`);
    } else {
      return res.json(results.rows);
    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
