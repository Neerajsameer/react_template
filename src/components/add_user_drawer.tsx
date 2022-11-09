import { Stack, Group, Space, Select } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { createUser } from "../store/reducers/users.reducer";
import NTextBox from "./text_box";

export default function AddNewUserDrawer() {
    const [uCreationData, setUCreationData] = useSetState<any>({} as any);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const masterData = useAppSelector((state) => state.auth.master_data);


    return <>
        <div style={{ overflowY: "auto", height: "90vh" }}>

            <Stack spacing={24}>
                <NTextBox
                    name="name"
                    onChange={(name, e) => setUCreationData({ ...uCreationData, [name]: e! })}
                    value={uCreationData.name}
                    label="Name"
                />
                <NTextBox
                    name="email"
                    onChange={(name, e) => setUCreationData({ ...uCreationData, [name]: e! })}
                    value={uCreationData.email}
                    label="Email"
                />
                <NTextBox
                    name="password"
                    onChange={(name, e) => setUCreationData({ ...uCreationData, [name]: e! })}
                    value={uCreationData.password}
                    label="Password"
                />
                <NTextBox
                    name="phone_number"
                    onChange={(name, e) => setUCreationData({ ...uCreationData, [name]: e! })}
                    value={uCreationData.phone_number}
                    label="Phone Number"
                />
                <Select
                    data={masterData.m_designation.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Designation"
                    name="m_designation_id"
                    onChange={(value) => {
                        setUCreationData({ m_designation_id: value })
                    }}
                    value={(uCreationData.m_designation_id ?? 0)?.toString() as any}
                />
                <Select
                    data={masterData.m_department.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Department"
                    name="m_department_id"
                    onChange={(value) => {
                        setUCreationData({ m_department_id: value })
                    }}
                    value={(uCreationData.m_department_id ?? 0)?.toString() as any}
                />
                <Select
                    data={masterData.m_user_types.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="User Type"
                    name="m_user_type_id"
                    onChange={(value) => {
                        setUCreationData({ m_user_type_id: value })
                    }}
                    value={(uCreationData.m_user_type_id ?? 0)?.toString() as any}
                />

                <Group position="right">
                    <NButton
                        label="Create User"
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await dispatch(createUser(uCreationData));
                            } catch (e: any) {
                                console.log(e);
                                showNotification({ title: "Error", message: e, color: "red" })
                            } finally {
                                setLoading(false);
                            }
                        }}
                    />
                </Group>
                <Space h={10} />
            </Stack>
        </div>


    </>
}