export default () => ({
  email: {
    transport: `smtp://${process.env.EMAIL_ID}:${process.env.EMAIL_PASSWORD}`,
    default: {
      from: `"${process.env.EMAIL_FROM_USER_NAME}" <${process.env.EMAIL_ID}>`,
    },
  },
});
