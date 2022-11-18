import { Group, Loader, Modal, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconEye } from "@tabler/icons";
import { ColumnType } from "antd/lib/table";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NLayout from "../components/layout";
import NTable from "../components/Table/table";
import { API_URLS } from "../constants/api_urls";
import NButton from "../framework/NButton";
import { useAppDispatch, useAppSelector } from "../store";
import { getFieldSurveys, setFieldSurveyExtraDetails, setFieldSurveyFilters } from "../store/reducers/field_survey.reducer";
import { Request } from "../utils/functions.utils";
import { SurveyDataComponent } from "./field_survey_data";

export default function FieldSurvey() {

    const dispatch = useAppDispatch();
    const fieldSurvey = useAppSelector((state) => state.field_survey);
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const navigate = useNavigate()

    useEffect(() => { dispatch(getFieldSurveys()) }, [fieldSurvey.filters])


    const columns: ColumnType<any>[] = [
        { title: 'S No', dataIndex: 's_no', key: 's_no', align: 'center' },
        { title: 'F ID', dataIndex: 'id', key: 'id', align: 'center' },
        { title: 'Repr Name', dataIndex: 'repr_name', key: 'repr_name' },
        { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (value, record) => { return <span>{moment(value).format("DD MMM yyyy, hh:mm A")}</span> } },
        { title: 'State', dataIndex: 'm_state_id', key: 'm_state_id', render: (value: any) => <>{masterData.m_state.find(x => x.m_state_id == value)?.state_name}</> },
        { title: 'District', dataIndex: 'm_district_id', key: 'm_district_id', render: (value: any) => <>{masterData.m_district.find(x => x.m_district_id == value)?.district_name}</> },
        { title: 'Designation', dataIndex: 'm_designation_id', key: 'm_designation_id', render: (value: any) => <>{masterData.m_designation[value]}</> },
        { title: 'Department', dataIndex: 'm_department_id', key: 'm_department_id', render: (value: any) => <>{masterData.m_department[value]}</> },
        {
            title: 'More', dataIndex: 'more', key: 'more', render: (value, record) => {
                return <IconEye onClick={() => dispatch(setFieldSurveyExtraDetails(record))} />
            }
        },
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
                <Select
                    data={masterData.m_department.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Department"
                    name="m_department_id"
                    onChange={(value) => {
                        dispatch(setFieldSurveyFilters({ m_department_id: value as any }))
                    }}
                    value={(fieldSurvey.filters.m_department_id)?.toString()}
                />
                <Select
                    data={masterData.m_state.map((item, i) => ({ label: item.state_name, value: item.m_state_id.toString() }))}
                    label="State"
                    name="m_state_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setFieldSurveyFilters({ m_state_id: value as any }))

                    }}
                    value={(fieldSurvey.filters.m_state_id)?.toString()}
                />
                <Select
                    data={masterData.m_district.filter(x => x.m_state_id == fieldSurvey.filters.m_state_id).map((item, i) => ({ label: item.district_name, value: item.m_district_id.toString() }))}
                    label="District"
                    name="m_district_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setFieldSurveyFilters({ m_district_id: value as any }))

                    }}
                    value={(fieldSurvey.filters.m_district_id)?.toString()}
                />
            </Group>
            <div style={{ width: "100%" }}>
                <NTable
                    data={fieldSurvey.data}
                    columns={columns}
                    loading={fieldSurvey.loading}
                    pageSize={10}
                    totalCount={10}
                />
            </div>
            <Modal
                opened={!!fieldSurvey.extra_details}
                onClose={() => {
                    dispatch(setFieldSurveyExtraDetails(null))
                }}
                title="Photos"
                padding="xl"
                size="90%"
            >
                <FiedlSurveyPopup />
            </Modal>
        </NLayout>
    </>
}


function FiedlSurveyPopup() {
    const fieldSurveyExtraDetails = useAppSelector((state) => state.field_survey.extra_details);
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Request.post({ url: API_URLS.DATA.field_survey, data: { id: (fieldSurveyExtraDetails as any).id } }).then(res => {
            console.log({ res: res })
            setData(res[0]);
            setLoading(false);
        })
    }, [])

    return (
        <>
            {
                loading ? <Loader /> :
                    <SurveyDataComponent surveyData={data!} masterData={masterData} />
            }
        </>
    );
}
