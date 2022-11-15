import { Group, MultiSelect, PasswordInput, Select, Space, Stack } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { createUser, setEditUserData } from "../store/reducers/users.reducer";
import NTextBox from "./text_box";

export default function AddNewUserDrawer() {
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const editUserData = useAppSelector((state) => state.users.edit_user_data);

    const handleOnChange = (name: string, value: any) => {
        dispatch(setEditUserData({ [name]: value }));
    };

    return <>
        <div style={{ overflowY: "auto", height: "90vh" }}>

            <Stack spacing={24}>
                <NTextBox
                    name="name"
                    onChange={(name, e) => handleOnChange(name, e)}
                    value={editUserData?.name}
                    label="Name"
                />
                <NTextBox
                    name="email"
                    onChange={(name, e) => handleOnChange(name, e)}
                    value={editUserData?.email}
                    label="Email"

                />
                {
                    !editUserData?.id_app_user ? <>
                        <PasswordInput
                            name="password"
                            onChange={(e) => handleOnChange("password", e.target.value)}
                            value={editUserData?.password}
                            label="Password"
                        />
                        <PasswordInput
                            name="re_enter_password"
                            onChange={(e) => handleOnChange("re_enter_password", e.target.value)}
                            value={editUserData?.re_enter_password}
                            label="Re-enter Password"
                        />
                    </> : <></>
                }

                <NTextBox
                    name="phone_number"
                    onChange={(name, e) => handleOnChange(name, e)}
                    value={editUserData?.phone_number}
                    label="Phone Number"
                />
                <Select
                    data={masterData.m_designation.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Designation"
                    name="m_designation_id"
                    onChange={(value) => {
                        handleOnChange("m_designation_id", value)
                    }}
                    value={(editUserData?.m_designation_id)?.toString() as any}
                />
                <Select
                    data={masterData.m_department.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Department"
                    name="m_department_id"
                    onChange={(value) => {
                        handleOnChange("m_department_id", value)
                    }}
                    value={(editUserData?.m_department_id)?.toString() as any}
                />
                <Select
                    data={masterData.m_state.map((item, i) => ({ label: item.state_name, value: item.m_state_id.toString() }))}
                    label="State"
                    name="m_state_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        handleOnChange("m_state_id", value)
                    }}
                    value={(editUserData?.m_state_id)?.toString() as any}
                />
                <MultiSelect
                    searchable
                    clearable
                    data={masterData.m_district.filter(x => x.m_state_id == editUserData?.m_state_id).map((item, i) => ({ label: item.district_name, value: item.m_district_id.toString() }))}
                    label="District"
                    name="m_district_id"
                    onChange={(value) => handleOnChange("m_district_id", value.map(x => parseInt(x)))}
                    value={editUserData?.m_district_id?.map(x => x.toString()) as any}
                />
                <Select
                    data={masterData.m_user_types.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="User Type"
                    name="m_user_type_id"
                    onChange={(value) => {
                        handleOnChange("m_user_type_id", value)
                    }}
                    value={(editUserData?.m_user_type_id)?.toString() as any}
                />

                <Group position="right">
                    <NButton
                        label={editUserData?.id_app_user ? "Update User" : "Create User"}
                        loading={loading}
                        onClick={async () => {
                            setLoading(true);
                            try {
                                await dispatch(createUser());
                            } catch (e: any) {
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