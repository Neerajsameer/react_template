import { Drawer, Group, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons";
import { ColumnType } from "antd/lib/table";
import moment from "moment";
import { useEffect } from "react";
import AddNewUserDrawer from "../components/add_user_drawer";
import NLayout from "../components/layout";
import NTable from "../components/Table/table";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { apiUserData, deleteUser, getUsers, setShowAddUserModal } from "../store/reducers/users.reducer";

export default function Users() {

    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users);
    const masterData = useAppSelector((state) => state.dashboard.master_data);

    useEffect(() => { dispatch(getUsers()) }, [])


    const deleteUserModal = (user_id: number) => openConfirmModal({

        title: 'Delete User',
        children: (
            <Text size="sm">
                This action is irresversable. Are you sure you want to delete this user?
            </Text>
        ),
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onCancel: () => console.log('Cancel'),
        onConfirm: () => {
            dispatch(deleteUser(user_id))
            showNotification({ message: "Deleting User", loading: true, autoClose: 500, color: "blue" })

        },
    });

    const columns: ColumnType<apiUserData>[] = [
        { fixed: true, title: 'S No', dataIndex: 's_no', key: 's_no', align: 'center' },
        { fixed: true, title: 'U ID', dataIndex: 'id_app_user', key: 'id_app_user', align: 'center' },
        { fixed: true, title: 'Name', dataIndex: 'name', key: 'name', },
        { fixed: true, title: 'Email', dataIndex: 'email', key: 'email', },
        { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number', },
        { title: 'State', dataIndex: 'm_state_id', key: 'm_state_id', render: (value: any) => <>{masterData.m_state.find(x => value == x.m_state_id)?.state_name}</> },
        { title: 'Districts', dataIndex: 'm_district_id', key: 'm_district_id', render: (value: any) => <>{value.map((district_id: any) => masterData.m_district.find(x => x.m_district_id == district_id)?.district_name).join(", ")}</> },
        { title: 'User Type', dataIndex: 'm_user_type_id', key: 'm_user_type_id', render: (value: any) => <>{masterData.m_user_types[value]}</> },
        { title: 'Designation', dataIndex: 'm_designation_id', key: 'm_designation_id', render: (value: any) => <>{masterData.m_designation[value]}</> },
        { title: 'Department', dataIndex: 'm_department_id', key: 'm_department_id', render: (value: any) => <>{masterData.m_department[value]}</> },
        { title: 'Created At', dataIndex: 'added_on', key: 'added_on', render: (value, record) => { return <span>{moment(value).format("DD MMM yyyy, hh:mm A")}</span> } },
        {
            fixed: true, title: 'Actions', dataIndex: 'actions', key: 'actions',
            render: (value, record) => {
                return (
                    <Group>
                        <IconTrash onClick={() => deleteUserModal(record.id_app_user)} />
                        <IconEdit onClick={() => dispatch(setShowAddUserModal({ show: true, data: record }))} />
                    </Group>
                )
            }
        },
    ];

    return <>
        <NLayout title="Users">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <NButton label="Add New User" onClick={() => dispatch(setShowAddUserModal({ show: true }))} />
            </div>

            <div style={{ width: "100%" }}>
                <NTable
                    data={users.data}
                    columns={columns}
                    loading={users.loading}
                    pageSize={10}
                    totalCount={10}
                />
            </div>

            <Drawer
                padding={"xl"}
                size={400}
                position="right"
                onClose={() => dispatch(setShowAddUserModal({ show: false }))}
                opened={!!users.show_add_user_modal}
                title="Add New User"
                styles={{ title: { fontWeight: 600 } }}
            >
                <AddNewUserDrawer />
            </Drawer>
        </NLayout>

    </>


}
