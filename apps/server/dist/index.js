import express from "express";
const PORT = 3000;
const app = express();
app.get("/", (_, res) => {
    res.sendStatus(200);
});
app.listen(3000, () => {
    console.log(`express server started in port: ${PORT}`);
});
//# sourceMappingURL=index.js.map