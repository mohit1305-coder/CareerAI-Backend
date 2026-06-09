export const loginUser = TryCatch(async (req, res) => {
  try {
    const { code } = req.body;

    console.log("Received code:", code);

    const googleRes = await oauth2client.getToken(code);

    console.log("Google token response:", googleRes.tokens);

    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );

    console.log("Google user:", userRes.data);

    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        image: picture,
      });
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.JWT_SEC as string,
      { expiresIn: "15d" }
    );

    res.json({
      message: "User Logged in",
      token,
      user,
    });
  } catch (error: any) {
    console.error("GOOGLE LOGIN ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
});