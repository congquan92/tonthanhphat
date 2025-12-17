import app from "./index.js";
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
