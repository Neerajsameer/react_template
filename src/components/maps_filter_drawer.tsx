import { ScrollArea, Group, Drawer, Divider, Checkbox, Space, Select } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useAppDispatch, useAppSelector } from "../store";
import { setShowFilters, setMapFilters } from "../store/reducers/map_view.reducer";

export function MapFiltersDrawer() {
    const dispatch = useAppDispatch();
    const mapData = useAppSelector((state) => state.map_view);
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const users = useAppSelector((state) => state.dashboard.dept_users);



    return (
        <Drawer
            title="Apply Filters"
            opened={mapData.show_filters}
            size={"380px"}
            styles={{ title: { fontWeight: 700 } }}
            onClose={() => { dispatch(setShowFilters(false)) }}
            overlayColor="none"
            padding={10}
        >
            <ScrollArea style={{ height: "100%" }}>
                <Group grow>
                    <DatePicker
                        label="From Date"
                        placeholder='Select From Date'
                        value={mapData.filters.from_date}
                        name="from_date"
                        required={false}
                        onChange={(date) => {
                            dispatch(setMapFilters({ from_date: date }))
                        }}
                    />
                    <DatePicker
                        label="To Date"
                        clearable
                        placeholder='Select To Date'
                        value={mapData.filters.to_date}
                        name="to_date"
                        required={false}
                        onChange={(date) => {
                            dispatch(setMapFilters({ to_date: date }))
                        }}
                    />
                </Group>

                <Divider my={20} />

                {/* <Group grow> */}
                <Select
                    data={masterData.m_state.map((item, i) => ({ label: item.state_name, value: item.m_state_id.toString() }))}
                    label="State"
                    name="m_state_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setMapFilters({ m_state_id: value as any }))

                    }}
                    value={(mapData.filters.m_state_id)?.toString()}
                />
                <Select
                    data={masterData.m_district.filter(x => x.m_state_id == mapData.filters.m_state_id).map((item, i) => ({ label: item.district_name, value: item.m_district_id.toString() }))}
                    label="District"
                    name="m_district_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setMapFilters({ m_district_id: value as any }))
                    }}
                    value={(mapData.filters.m_district_id)?.toString()}
                />
                <Divider my={20} />

                {/* </Group> */}
                <Checkbox.Group
                    label="Complaint Types"
                    orientation="vertical"
                    spacing="xs"
                    size='sm'
                    value={mapData.filters.complaint_types}
                    onChange={(values) => {
                        dispatch(setMapFilters({ complaint_types: values }))
                    }}
                    styles={{ label: { fontWeight: 700, fontSize: 16 } }}
                >
                    {
                        masterData.m_bad_road_type_list?.map((item, i) => {
                            return <Checkbox key={i} label={item} value={i.toString()} />
                        })
                    }
                </Checkbox.Group>
                <Divider my={20} />
                <Checkbox.Group
                    label="Appreciation Types"

                    orientation="vertical"
                    spacing="xs"
                    size='sm'
                    mt={20}
                    value={mapData.filters.appreciation_types}
                    onChange={(values) => {
                        dispatch(setMapFilters({ appreciation_types: values }))
                    }}
                    styles={{ label: { fontWeight: 700, fontSize: 16 } }}
                >
                    {
                        masterData.m_good_road_type_list?.map((item, i) => {
                            return <Checkbox key={i} label={item} value={i.toString()} />
                        })
                    }
                </Checkbox.Group>
                <Divider my={20} />
                <Checkbox
                    key={"field_survey"}
                    label={"Field Survey"}
                    value={"field_survey"}
                    checked={mapData.filters.field_survey}
                    onChange={(e) => {
                        dispatch(setMapFilters({ field_survey: e.currentTarget.checked }))
                    }}
                />
                <Space h={20} />
                <Select
                    data={masterData.m_department.map((item, i) => ({ label: item, value: i.toString() }))}
                    label="Department"
                    name="m_department_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setMapFilters({ m_department_id: value as any }))
                    }}
                    value={(mapData.filters.m_department_id)?.toString()}
                />
                <Select
                    data={users.filter(x => x.m_department_id == mapData.filters.m_department_id).map((item, i) => ({ label: item.name, value: item.id_app_user.toString() }))}
                    label="User"
                    name="m_user_id"
                    searchable
                    clearable
                    onChange={(value) => {
                        dispatch(setMapFilters({ m_user_id: value as any }))
                    }}
                    value={(mapData.filters.m_user_id)?.toString()}
                />
                <Space h={100} />
            </ScrollArea>
        </Drawer>
    )
}