const provider = process.env.EMAIL_PROVIDER;

if (provider === "brevo") {
  module.exports = require("./sendEmail.brevo");
} else {
  throw new Error(`Invalid EMAIL_PROVIDER: ${provider}. Expected "brevo".`);
}
