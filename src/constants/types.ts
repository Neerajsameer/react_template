export type MasterData = {
  m_bad_road_type_list: string[];
  m_defects: string[];
  m_designation: string[];
  m_department: string[];
  m_user_types: string[];
  m_electrical_supply: string[];
  m_good_road_type_list: string[];
  m_hotspot: string[];
  m_is_accident_occured: string[];
  m_junc_formation: string[];
  m_junc_type: string[];
  m_landmark_type: string[];
  m_landuse_pattern: string[];
  m_lighting_availability: string[];
  m_nature_of_spot: string[];
  m_obstruction_for_driver: string[];
  m_rash_drivers: string[];
  m_rash_driving_enforcement_solutions: string[];
  m_road_condition_solutions: string[];
  m_road_engineering_suggestions: string[];
  m_road_user_violations: string[];
  m_spot_visibility: string[];
  m_stretch_shape: string[];
  m_stretch_type: string[];
  m_switching_type: string[];
  m_user_violation_enforcement_solutions: string[];
  m_vehicle_type: string[];
  m_no_of_lanes: string[];
  m_state: {
    iso_code: string;
    m_state_id: number;
    state_name: string;
  }[];
  m_district: {
    district_name: string;
    m_district_id: number;
    m_state_id: number;
  }[];
};

type ImageData = {};
type PeakHours = {
  start_time: string;
  end_time: string;
};

export type FieldSurveyDataType = {
  f_survey_general_details: {
    repr_name?: string;
    added_on: string;
    m_designation_id?: number;
    m_department_id?: number;
    phone_number?: string;
    email_id?: string;
    remarks?: string;
    lattitude?: number;
    longitude?: number;
    m_district_id: number;
    m_state_id: number;
  };
  f_survey_road_details: {
    lat_long: { latitude: number; longitude: number };
    highway_number?: string;
    m_landuse_pattern_id?: number;
    m_hotspot_id?: number;
    m_junc_type_id?: number;
    junc_name?: string;
    m_junc_formation_id?: number;
    m_stretch_type_id?: number;
    m_stretch_shape_id?: number;
    no_of_lanes_id?: number;
    no_of_lanes_other?: string;
    is_median: boolean;
    m_nature_of_spot_id?: number;
    speed_of_all_vehicles?: string;
    no_of_small_t_junctions?: string;
    landmark_name?: string;
    m_landmark_type_id?: number;
    m_landmark_type_other?: string;
    landmark_distance_from_the_hotspot?: string;
    photos: ImageData[];
  };
  f_survey_traffic_conditions: {
    peak_hours: PeakHours[];
    m_vehicle_type_id: number[];
  };
  f_survey_traffic_signal_status: {
    is_signal_available?: boolean;
    is_signal_visible?: boolean;
    is_signal_working?: boolean;
    is_signal_timer_working?: boolean;
    is_signal_needed?: boolean;
    signal_photos: ImageData[];
    is_signboard_available?: boolean;
    signboard_photos: ImageData[];
    is_road_marking_available?: boolean;
    road_marking_photos: ImageData[];
  };
  f_survey_lighting_condition: {
    m_lighting_availability_id?: number;
    m_switching_type_id?: number;
    m_electrical_supply_id?: number;
    m_spot_visibility_id?: number;
    is_accident_occured?: boolean;
    lighting_photos: ImageData[];
  };
  f_survey_visibility: {
    is_junc_visibility_obstructed?: boolean;
    m_obstruction_for_driver_id?: number[];
    m_obstruction_for_driver_other?: string;
    m_is_accident_occured_id?: number;
    is_signboard_obstructed?: boolean;
    m_road_engineering_suggestions_id?: number[];
    visibility_photos: ImageData[];
  };
  f_survey_road_condition: {
    is_road_condition_issue?: boolean;
    m_defects_id?: number[];
    m_defects_other?: string;
    m_road_engineering_solutions_id?: number[];
    m_road_engineering_solutions_other?: string;
    road_condition_photos: ImageData[];
  };
  f_survey_rash_driving_pattern: {
    m_rash_drivers_id?: number[];
    m_rash_drivers_other?: string;
    m_rash_driving_enforcement_solutions_id?: number[];
    m_rash_driving_enforcement_solutions_other?: string;
  };
  f_survey_road_user_violation: {
    is_road_user_violation_present?: boolean;
    m_road_user_violations_id?: number[];
    m_road_user_violations_other?: string;
    m_user_violation_enforcement_solutions_id?: number[];
    m_user_violation_enforcement_solutions_other?: string;
  };
  user_data: {
    email: string;
    id_app_user: number;
    name: string;
    phone_number: string;
  };
};
