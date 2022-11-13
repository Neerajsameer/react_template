import { ScrollArea, Group, Drawer, Divider, Checkbox, Space } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useAppDispatch, useAppSelector } from "../store";
import { setShowFilters, setMapFilters } from "../store/reducers/map_view.reducer";

export function MapFiltersDrawer() {
    const dispatch = useAppDispatch();
    const mapData = useAppSelector((state) => state.map_view);
    const masterData = useAppSelector((state) => state.auth.master_data);



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
                    defaultValue={['react']}
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
                <Space h={50} />
            </ScrollArea>
        </Drawer>
    )
}