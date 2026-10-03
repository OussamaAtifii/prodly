const fs = require("fs");
const path = require("path");
const successColor = "\x1b[32m%s\x1b[0m";
const checkSign = "\u{2705}";
const dotenv = require("dotenv").config({ path: "src/.env" });

const envFile = `export const environment = {
    API_URL: '${process.env.API_URL}',
    SOCKET_URL: '${process.env.SOCKET_URL}',
    DEMO_USER_EMAIL: '${process.env.DEMO_USER_EMAIL}',
    DEMO_USER_PASSWORD: '${process.env.DEMO_USER_PASSWORD}'
};
`;
const targetPath = path.join(__dirname, "./src/environments/environment.ts");
fs.writeFile(targetPath, envFile, (err) => {
  if (err) {
    console.error(err);
    throw err;
  } else {
    console.log(
      successColor,
      `${checkSign} Successfully generated environment.ts`,
    );
  }
});
