import { Center, Divider, Loader, SimpleGrid, Space, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import NLayout from "../components/layout";
import { API_URLS } from '../constants/api_urls';
import { FieldSurveyDataType, MasterData } from "../constants/types";
import { useAppDispatch, useAppSelector } from "../store";
import { getUsers } from "../store/reducers/users.reducer";
import { Request } from "../utils/functions.utils";

export default function FieldSurveyData() {

    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const dispatch = useAppDispatch();
    const [surveyData, setSurveyData] = useState<FieldSurveyDataType>();
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams()


    useEffect(() => {
        const survey_id = searchParams.get("survey_id")
        if (!survey_id) {
            setLoading(false)
            return
        }
        Request.post({ url: API_URLS.DATA.field_survey, data: { f_survey_general_details_id: survey_id } }).then(res => {
            console.log({ res: res })
            setSurveyData(res[0]);
            setLoading(false);
        })
    }, [])

    // const surveyData = {
    //     f_survey_general_details: {},
    //     f_survey_road_details: {},
    //     f_survey_traffic_conditions: {},
    //     f_survey_traffic_signal_status: {},
    //     f_survey_lighting_condition: {},
    //     f_survey_visibility: {},
    //     f_survey_road_condition: {},
    //     f_survey_rash_driving_pattern: {},
    //     f_survey_road_user_violation: {},
    // } as FieldSurveyDataType

    useEffect(() => { dispatch(getUsers()) }, [])

    console.log({ surveyData })

    if (loading && !surveyData) return <NLayout backLink="/field_survey" title="Field Survey Data"> <Center><Loader /></Center></NLayout>
    if (!loading && !surveyData) return <NLayout backLink="/field_survey" title="Field Survey Data"><Center><Text>Data not Found</Text></Center></NLayout>
    if (!surveyData) return <NLayout backLink="/field_survey" title="Field Survey Data"><Center><Text>Data not Found</Text></Center></NLayout>

    return (
        <NLayout title="Field Survey Data" backLink="/field_survey">
            <SurveyDataComponent masterData={masterData} surveyData={surveyData} />
        </NLayout>
    )
}

export function SurveyDataComponent({ surveyData, masterData }: { surveyData: FieldSurveyDataType, masterData: MasterData }) {
    return (
        <>
            <FSection title="General Details">
                <DText question="Representative Name" answer={surveyData.f_survey_general_details.repr_name} />
                <DText question="Designation" answer={surveyData.f_survey_general_details.m_designation_id} masterList={masterData.m_designation} />
                <DText question="Department" answer={surveyData.f_survey_general_details.m_department_id} masterList={masterData.m_department} />
                <DText question="Phone Number" answer={surveyData.f_survey_general_details.phone_number} />
                <DText question="Email ID" answer={surveyData.f_survey_general_details.email_id} />
            </FSection>
            <Space h={20} />
            <FSection title="Road Details">
                <DText question="Highway Number" answer={surveyData.f_survey_road_details.highway_number} />
                <DText question="Land Use Pattern" answer={surveyData.f_survey_road_details.m_landuse_pattern_id} masterList={masterData.m_landuse_pattern} />
                <DText question="Type of Hotspot" answer={surveyData.f_survey_road_details.m_hotspot_id} masterList={masterData.m_hotspot} />
                <DText question="Type of Junction" answer={surveyData.f_survey_road_details.m_junc_type_id} masterList={masterData.m_junc_type} />
                <DText question="Junction Name" answer={surveyData.f_survey_road_details.junc_name} />
                <DText question="Formation of Junction" answer={surveyData.f_survey_road_details.m_junc_formation_id} masterList={masterData.m_junc_formation} />
                <DText question="Stretch Type" answer={surveyData.f_survey_road_details.m_stretch_type_id} masterList={masterData.m_stretch_type} />
                <DText question="Stretch Shape" answer={surveyData.f_survey_road_details.m_stretch_shape_id} masterList={masterData.m_stretch_shape} />
                <DText question="No. of Lanes" answer={surveyData.f_survey_road_details.no_of_lanes_id} masterList={masterData.m_no_of_lanes} />
                <DText question="Other's specify" answer={surveyData.f_survey_road_details.no_of_lanes_other} />
                <DText question="Presence of Median" answer={surveyData.f_survey_road_details.is_median} />
                <DText question="Nature of Spot" answer={surveyData.f_survey_road_details.m_nature_of_spot_id} masterList={masterData.m_nature_of_spot} />
                <DText question="Speed of all Vehicles" answer={surveyData.f_survey_road_details.speed_of_all_vehicles} />
                <DText question="No. of small T-Junctions" answer={surveyData.f_survey_road_details.no_of_small_t_junctions} />
                <DText question="Landmark Name" answer={surveyData.f_survey_road_details.landmark_name} />
                <DText question="Landmark Type" answer={surveyData.f_survey_road_details.m_landmark_type_id} masterList={masterData.m_landmark_type} />
                <DText question="Other's - specify" answer={surveyData.f_survey_road_details.m_landmark_type_other} />
                <DText question="Landmark Distance from the hotspot (m)" answer={surveyData.f_survey_road_details.landmark_distance_from_the_hotspot} />
            </FSection>
            <Space h={20} />
            <FSection title="Traffic Conditions">
                <DText question="Peak Hours" answer={surveyData.f_survey_traffic_conditions.peak_hours.map(x => (x.start_time + " - " + x.end_time)).join(", \n")} />
                <DText question="Prevalent vehicle type" answer={surveyData.f_survey_traffic_conditions.m_vehicle_type_id} masterList={masterData.m_vehicle_type} />
            </FSection>
            <Space h={20} />
            <FSection title="Traffic Signal Status">
                <DText question="Signal Availability" answer={surveyData.f_survey_traffic_signal_status.is_signal_available} />
                <DText question="Is signal visible ?" answer={surveyData.f_survey_traffic_signal_status.is_signal_available} />
                <DText question="Is signal working ?" answer={surveyData.f_survey_traffic_signal_status.is_signal_working} />
                <DText question="Is signal timer working ?" answer={surveyData.f_survey_traffic_signal_status.is_signal_timer_working} />
                <DText question="Is signal needed ?" answer={surveyData.f_survey_traffic_signal_status.is_signal_needed} />
                <DText question="Signboards on road information" answer={surveyData.f_survey_traffic_signal_status.is_signboard_available} />
                <DText question="Availablity of Road Markings" answer={surveyData.f_survey_traffic_signal_status.is_road_marking_available} />
            </FSection>
            <Space h={20} />
            <FSection title="Lighting Condition">
                <DText question="Lighting availability" answer={surveyData.f_survey_lighting_condition.m_lighting_availability_id} masterList={masterData.m_lighting_availability} />
                <DText question="Switching type" answer={surveyData.f_survey_lighting_condition.m_switching_type_id} masterList={masterData.m_switching_type} />
                <DText question="Electrical Supply" answer={surveyData.f_survey_lighting_condition.m_electrical_supply_id} masterList={masterData.m_electrical_supply} />
                <DText question="Spot Visibility" answer={surveyData.f_survey_lighting_condition.m_spot_visibility_id} masterList={masterData.m_spot_visibility} />
                <DText question="Has non-availability of Lights caused accidents at the spot?" answer={surveyData.f_survey_lighting_condition.is_accident_occured} />
            </FSection>
            <Space h={20} />
            <FSection title="Visibility">
                <DText question="Is visibility of the junction obstructed by any objects?" answer={surveyData.f_survey_visibility.is_junc_visibility_obstructed} />
                <DText question="Obstruction for the driver" answer={surveyData.f_survey_visibility.m_obstruction_for_driver_id} masterList={masterData.m_obstruction_for_driver} />
                <DText question="Other's - Specify" answer={surveyData.f_survey_visibility.m_obstruction_for_driver_other} />
                <DText question="Has it caused accidents at the spot ?" answer={surveyData.f_survey_visibility.m_is_accident_occured_id} masterList={masterData.m_is_accident_occured} />
                <DText question="Is the Signboard getting obstructed?" answer={surveyData.f_survey_visibility.is_signboard_obstructed} />
                <DText question="Road engineering suggestions to avoid the accident - Visibility" answer={surveyData.f_survey_visibility.m_road_engineering_suggestions_id} masterList={masterData.m_road_engineering_suggestions} />
            </FSection>
            <Space h={20} />
            <FSection title="Road Condition">
                <DText question="Is there any issues in the condition of the road which are causing accidents at this spot ?" answer={surveyData.f_survey_road_condition.is_road_condition_issue} />
                <DText question="Defects" answer={surveyData.f_survey_road_condition.m_defects_id} masterList={masterData.m_defects} />
                <DText question="Road engineering solutions - Road Condition" answer={surveyData.f_survey_road_condition.m_road_engineering_solutions_id} masterList={masterData.m_road_condition_solutions} />
                <DText question="Others - Specify" answer={surveyData.f_survey_road_condition.m_road_engineering_solutions_other} />
            </FSection>
            <Space h={20} />
            <FSection title="Rash Driving Pattern">
                <DText question="Rash drivers" answer={surveyData.f_survey_rash_driving_pattern.m_rash_drivers_id} masterList={masterData.m_rash_drivers} />
                <DText question="Others - Specify" answer={surveyData.f_survey_rash_driving_pattern.m_rash_drivers_other} />
                <DText question="Enforcement solutions - Rash driving" answer={surveyData.f_survey_rash_driving_pattern.m_rash_driving_enforcement_solutions_id} masterList={masterData.m_rash_driving_enforcement_solutions} />
                <DText question="Others - Specify" answer={surveyData.f_survey_rash_driving_pattern.m_rash_driving_enforcement_solutions_other} />
            </FSection>
            <Space h={20} />
            <FSection title="Road User Violation">
                <DText question="Presense of road user violation" answer={surveyData.f_survey_road_user_violation.is_road_user_violation_present} />
                <DText question="Road user violations - Causing accidents" answer={surveyData.f_survey_road_user_violation.m_road_user_violations_id} masterList={masterData.m_road_user_violations} />
                <DText question="Others - Specify" answer={surveyData.f_survey_road_user_violation.m_road_user_violations_other} />
                <DText question="Enforcement solutions - Road user violations" answer={surveyData.f_survey_road_user_violation.m_user_violation_enforcement_solutions_id} masterList={masterData.m_user_violation_enforcement_solutions} />
                <DText question="Others - Specify" answer={surveyData.f_survey_road_user_violation.m_user_violation_enforcement_solutions_other} />
            </FSection>
        </>
    )
}



function FSection({ title, children }: { title: string, children: any }) {
    return (
        <>
            <Text weight={"bolder"} size="lg" color={"orange"}>{title}</Text>
            <Space h={20} />
            <SimpleGrid cols={3}>
                {children}
            </SimpleGrid>
            <Divider my={20} />
        </>
    )
}


function DText({ question, answer, masterList }: { question: string, answer: any, masterList?: string[] }) {

    let value;

    if (masterList) {
        if (typeof answer == "object") value = answer?.map((item: any) => masterList[item]).join(", ")
        else value = masterList[answer]
    } else value = answer


    return (
        <div>
            <Text size="md" weight={"bold"} >{question}</Text>
            <Text size="md">{value ?? "-"}</Text>
        </div>
    )
}