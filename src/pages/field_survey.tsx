import { Group } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { ColumnType } from "antd/lib/table";
import moment from "moment";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NLayout from "../components/layout";
import NTable from "../components/Table/table";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { getFieldSurveys, setFieldSurveyFilters } from "../store/reducers/field_survey.reducer";

export default function FieldSurvey() {

    const dispatch = useAppDispatch();
    const fieldSurvey = useAppSelector((state) => state.field_survey);
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const navigate = useNavigate()

    useEffect(() => { dispatch(getFieldSurveys()) }, [])


    const columns: ColumnType<any>[] = [
        { title: 'S No', dataIndex: 's_no', key: 's_no', align: 'center' },
        { title: 'F ID', dataIndex: 'id', key: 'id', align: 'center' },
        { title: 'Repr Name', dataIndex: 'repr_name', key: 'repr_name' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (value, record) => { return <span>{moment(value).format("DD MMM yyyy, hh:mm A")}</span> } },
        { title: 'State', dataIndex: 'm_state_id', key: 'm_state_id', render: (value: any) => <>{masterData.m_state.find(x => x.m_state_id == value)?.state_name}</> },
        { title: 'District', dataIndex: 'm_district_id', key: 'm_district_id', render: (value: any) => <>{masterData.m_district.find(x => x.m_district_id == value)?.district_name}</> },
        { title: 'Designation', dataIndex: 'm_designation_id', key: 'm_designation_id', render: (value: any) => <>{masterData.m_designation[value]}</> },
        { title: 'Department', dataIndex: 'm_department_id', key: 'm_department_id', render: (value: any) => <>{masterData.m_department[value]}</> },
    ];

    return <>
        <NLayout title="Field Surveys">
            <Group mb={20}>
                <DatePicker
                    label="From Date"
                    value={fieldSurvey.filters.from_date}
                    name="from_date"
                    required={false}
                    onChange={(date) => {
                        dispatch(setFieldSurveyFilters({ from_date: date }))
                    }}
                />
                <DatePicker
                    label="To Date"
                    value={fieldSurvey.filters.to_date}
                    name="to_date"
                    required={false}
                    onChange={(date) => {
                        dispatch(setFieldSurveyFilters({ to_date: date }))
                    }}
                />
            </Group>
            <div style={{ width: "100%" }}>
                <NTable
                    data={fieldSurvey.data}
                    columns={columns}
                    loading={fieldSurvey.loading}
                    pageSize={10}
                    totalCount={10}
                    onRowClick={(record) => navigate(`/field_survey_data?survey_id=${record.id}`)}
                />
            </div>
        </NLayout>

    </>
}

