import { Anchor, Center, Grid, Group, PasswordInput, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery, useSetState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import NTextBox from "../components/text_box";
import { AppImages } from "../constants/app_images";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { changePassword, loginReqAuthentication, sendOTP } from "../store/reducers/Auth.reducers";

export default function Login() {
  const [loginForm, setLoginForm] = useSetState({ email: "", password: "" });
  const [forgotPassForm, setForgotPassForm] = useSetState({ otp: "", password: "", reenter_password: "" });
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const isVisible = useMediaQuery("(max-width: 1000px)");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Grid columns={6} style={{ height: "100%" }} p={0} m={0}>
        <Grid.Col sm={6} md={4}>
          {isVisible ? null : (
            <img src={AppImages.loginBG} alt="" width={"100%"} height={"90%"} style={{ objectFit: "cover" }} />
          )}
        </Grid.Col>
        <Grid.Col sm={6} md={2}>
          <Center style={{ height: "100%" }}>
            <Stack spacing={10} style={{ background: "white", boxShadow: "1px 1px 10px -1px grey" }}>
              <Stack style={{ background: "#F0AA3C" }} p={10} spacing={0}>
                <Title order={3} ta="center">
                  Road Safety Survey and Audit
                </Title>
                <Text ta="center">(RSSA)</Text>
              </Stack>

              <Group position="center" mt={20} spacing={20}>
                <img height={100} src={AppImages.morthLogo} alt="" />
                <img height={100} src={AppImages.rgbLogo} alt="" />
              </Group>
              <Stack px={30} py={10}>
                {forgotPassword ? (
                  <Stack>
                    <NTextBox
                      label="Email"
                      placeholder="Email Address"
                      required
                      onChange={(name, value) => setForgotPassForm({ [name]: value })}
                      value={loginForm.email}
                      name="email"
                    />
                    {otpSent && (
                      <Stack>
                        <NTextBox
                          label="OTP"
                          name="otp"
                          placeholder="OTP"
                          required
                          onChange={(name, e) => setForgotPassForm({ otp: e as any })}
                        />
                        <PasswordInput
                          label="Password"
                          placeholder="Password"
                          required
                          onChange={(e) => setForgotPassForm({ password: e.target.value })}
                          mb={10}
                        />
                        <PasswordInput
                          label="Re-enter Password"
                          placeholder="Password"
                          required
                          onChange={(e) => setForgotPassForm({ reenter_password: e.target.value })}
                          mb={10}
                        />
                      </Stack>
                    )}
                    {otpSent && (
                      <Group position="right">
                        <Anchor onClick={() => setForgotPassword(true)}>Resend OTP</Anchor>
                      </Group>
                    )}

                    <NButton
                      fullWidth
                      label={otpSent ? "Change Password" : "Send OTP"}
                      loading={auth.loading}
                      onClick={async () => {
                        if (otpSent) {
                          try {
                            if (!forgotPassForm.password) throw "All fields are required";
                            if (forgotPassForm.password !== forgotPassForm.reenter_password)
                              throw "Passwords do not match";

                            await dispatch(
                              changePassword(loginForm.email, forgotPassForm.password, forgotPassForm.otp)
                            );
                            window.location.reload();
                          } catch (e: any) {
                            showNotification({ message: e, title: "Error", color: "red" });
                          }
                        } else {
                          try {
                            await dispatch(sendOTP(loginForm.email));
                            setOtpSent(true);
                          } catch (e: any) {
                            showNotification({ message: e, title: "Error", color: "red" });
                          }
                        }
                      }}
                    />
                  </Stack>
                ) : (
                  <Stack>
                    <NTextBox
                      label="Email"
                      placeholder="Email Address"
                      required
                      onChange={(name, value) => setLoginForm({ [name]: value })}
                      value={loginForm.email}
                      name="email"
                    />
                    <PasswordInput
                      label="Password"
                      placeholder="Password"
                      required
                      onChange={(e) => setLoginForm({ password: e.target.value })}
                      mb={10}
                    />
                    <Group position="right">
                      <Anchor onClick={() => setForgotPassword(true)}>Forgot password?</Anchor>
                    </Group>

                    <NButton
                      fullWidth
                      label="Log In"
                      loading={auth.loading}
                      onClick={async () => {
                        try {
                          await dispatch(loginReqAuthentication(loginForm.email, loginForm.password));
                          window.location.replace("/");
                        } catch (e: any) {
                          showNotification({ message: e, title: "Error", color: "red" });
                        }
                      }}
                    />
                  </Stack>
                )}

                <Group position="center" mt={20}>
                  <img height={80} src={AppImages.logo} alt="" />
                </Group>
              </Stack>
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    </div>
  );
}
