import { Anchor, Button, Center, Checkbox, Container, Grid, Group, Paper, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { Divider } from "antd";
import NTextBox from "../components/text_box";
import { AppImages } from "../constants/app_images";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { login, loginReqAuthentication } from "../store/reducers/Auth.reducers";

export default function Login() {
    const [loginForm, setLoginForm] = useSetState({ email: "", password: "" });
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);


    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <Grid columns={6} style={{ height: "100%" }} p={0} m={0}>
                <Grid.Col span={4}>
                    <img src={AppImages.loginBG} alt="" width={"100%"} height={"100%"} style={{ objectFit: 'cover' }} />
                </Grid.Col>
                <Grid.Col span={2} >
                    <Center style={{ height: "100%", }}>
                        <Stack spacing={10} style={{ background: "white", boxShadow: "1px 1px 10px -1px grey" }}>
                            <Stack style={{ background: '#F0AA3C' }} p={10} spacing={0}>
                                <Title order={3} ta="center">Center of Excellence for Road Safety</Title>
                                <Text ta="center">(CoERS)</Text>
                            </Stack>

                            <Group position="center" mt={20} spacing={20}>
                                <img height={100} src={AppImages.morthLogo} alt="" />
                                <img height={100} src={AppImages.rgbLogo} alt="" />
                            </Group>
                            <Stack px={30} py={10}>
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

                                <NButton
                                    fullWidth
                                    label="Log In"
                                    loading={auth.loading}
                                    onClick={async () => {
                                        try {
                                            await dispatch(loginReqAuthentication(loginForm.email, loginForm.password))
                                            window.location.replace("/");
                                        } catch (e: any) {
                                            showNotification({ message: e, title: "Error", color: "red" });
                                        }
                                    }}
                                />
                                <Group position="center" mt={20}>
                                    <img height={80} src={AppImages.logo} alt="" />
                                </Group>
                            </Stack>

                        </Stack>
                    </Center>
                </Grid.Col>
            </Grid>
        </div>

    )
}
