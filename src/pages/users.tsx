import { Drawer } from "@mantine/core";
import { ColumnType } from "antd/lib/table";
import moment from "moment";
import { useEffect } from "react";
import AddNewUserDrawer from "../components/add_user_drawer";
import NLayout from "../components/layout";
import NTable from "../components/Table/table";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { getUsers, setShowAddUserModal } from "../store/reducers/users.reducer";

export default function Users() {

    const dispatch = useAppDispatch();
    const users = useAppSelector((state) => state.users);
    const masterData = useAppSelector((state) => state.auth.master_data);

    useEffect(() => { dispatch(getUsers()) }, [])


    const columns: ColumnType<any>[] = [
        { title: 'S No', dataIndex: 's_no', key: 's_no', align: 'center' },
        { title: 'U ID', dataIndex: 'id_app_user', key: 'id_app_user', align: 'center' },
        { title: 'Name', dataIndex: 'name', key: 'name', },
        { title: 'Email', dataIndex: 'email', key: 'email', },
        { title: 'Phone Number', dataIndex: 'phone_number', key: 'phone_number', },
        { title: 'User Type', dataIndex: 'm_user_type_id', key: 'm_user_type_id', render: (value: any) => <>{masterData.m_user_types[value]}</> },
        { title: 'Designation', dataIndex: 'm_designation_id', key: 'm_designation_id', render: (value: any) => <>{masterData.m_designation[value]}</> },
        { title: 'Department', dataIndex: 'm_department_id', key: 'm_department_id', render: (value: any) => <>{masterData.m_department[value]}</> },
        { title: 'Created At', dataIndex: 'added_on', key: 'added_on', render: (value, record) => { return <span>{moment(value).format("DD MMM yyyy, hh:mm A")}</span> } },
    ];

    return <>
        <NLayout title="Users">
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <NButton label="Add New User" onClick={() => dispatch(setShowAddUserModal(true))} />
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
                onClose={() => dispatch(setShowAddUserModal(false))}
                opened={!!users.show_add_user_modal}
                title="Add New User"
                styles={{ title: { fontWeight: 600 } }}
            >
                <AddNewUserDrawer />
            </Drawer>
        </NLayout>

    </>
}

