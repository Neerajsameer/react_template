import { Divider, Group, Text } from '@mantine/core';
import { IconFilter } from '@tabler/icons';
import { divIcon, geoJSON } from 'leaflet';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import districtsJson from '../assets/geojson/districts.json';
import indiaJson from '../assets/geojson/india.json';
import { markerSVG } from '../components/icons';
import NLayout from '../components/layout';
import { MapFiltersDrawer } from '../components/maps_filter_drawer';
import { API_URLS } from '../constants/api_urls';
import { useAppDispatch, useAppSelector } from '../store';
import { getMapData, setExtraDetails, setMapFilters, setShowFilters } from '../store/reducers/map_view.reducer';
import { Request } from '../utils/functions.utils';
import { feature } from 'topojson-client';

export default function MapView() {

    const x: GeoJSON.BBox = [72.4, 6.7, 97.4, 35.5];

    const dispatch = useAppDispatch();
    const mapData = useAppSelector((state) => state.map_view);
    const masterData = useAppSelector((state) => state.dashboard.master_data);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!mapData.filters.from_date || !mapData.filters.to_date) dispatch(setShowFilters(true))
        dispatch(getMapData())
    }, [mapData.filters]);

    useEffect(() => {
        if (mapData.loading) setShow(true);
        else setShow(false);
    }, [mapData.loading]);

    useEffect(() => {
        if (mapData.filters.appreciation_types?.length == 0 && mapData.filters.complaint_types?.length == 0) {
            dispatch(setMapFilters({
                appreciation_types: masterData.m_good_road_type_list.map((item, i) => i.toString()),
                complaint_types: masterData.m_bad_road_type_list.map((item, i) => i.toString()),
                field_survey: true
            }));
        }
    }, [])

    const districtGeoData = feature(districtsJson as any, { type: 'GeometryCollection', geometries: (districtsJson as any).objects["India_Districts(733)_Updated(Centroid)"].geometries.filter((x: any) => mapData.district_ids.includes(x.properties.m_state_id)) });
    const indiaGeoData = feature(indiaJson as any, (indiaJson as any).objects["India"]);

    return (
        <>
            <NLayout title='Map View'>
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
                    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
                    crossOrigin=""
                />
                <Group position='right'>
                    <IconFilter onClick={() => { dispatch(setShowFilters(true)) }} />
                    {/* <IconFilter onClick={() => { setShow(prev => !prev) }} /> */}
                </Group>
                <MapContainer center={[21.146633, 79.088860]} zoom={6} minZoom={2} maxZoom={20} scrollWheelZoom={true} style={{ height: "calc(100vh - 120px)", zIndex: 1 }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        subdomains="abcd"
                    />

                    {
                        !show ?
                            <GeoJSON data={indiaGeoData} style={{ color: "#000000", weight: 0.3, opacity: 0.9, fillOpacity: 0, fill: false, dashOffset: "1.5" }} />
                            : <GeoJSON data={districtGeoData} style={{ color: "#000000", weight: 0.3, opacity: 0.9, fillOpacity: 0, fill: false, dashOffset: "1.5" }} />
                    }

                    {
                        mapData.data.map((item, i) => {
                            return <Marker
                                key={i}
                                eventHandlers={{
                                    click: () => {
                                        dispatch(setExtraDetails({
                                            clicked_id: item.id,
                                            clicked_type: item.type
                                        }))
                                    }
                                }}
                                position={[item.latitude, item.longitude]}
                                icon={divIcon({
                                    html: markerSVG(item.type), iconSize: [0, 0],
                                    iconAnchor: [0, 0]
                                })}>
                                {item.type == "survey" ? <SurveyPopUp id={item.id} /> : <FeedbackPopUp id={item.id} />}

                            </Marker>
                        })
                    }
                </MapContainer>
                <MapFiltersDrawer />
            </NLayout>
        </>
    )
}


function FeedbackPopUp({ id }: { id: number }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const masterData = useAppSelector((state) => state.dashboard.master_data);

    useEffect(() => {
        Request.get({ url: API_URLS.DATA.get_feedback(id) }).then((res) => {
            setData(res);
            setLoading(false);
        }).catch((err) => {
        })

    }, [])

    if (loading) return <span>Loading...</span>

    return (
        <Popup >
            <div style={{ width: "300px" }}>
                <Text size='sm' weight={800}>Feedback</Text>
                <Text size='xs' weight={500}>Taken By {data?.name} on {moment(data?.added_on).format("DD MMM, yyyy")}</Text>
                <Divider my={5} />
                <Group spacing={'xs'}>
                    <Text size='xs' weight={800}>Complaint:</Text>
                    <Text size='xs' weight={500}>{masterData.m_bad_road_type_list[data?.feedback_type]}</Text>
                </Group>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={800}>Comment:</Text>
                    <Text size='xs' weight={500}>{data?.comment}</Text>
                </Group>
            </div>
        </Popup>
    )
}

function SurveyPopUp({ id }: { id: number }) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const masterData = useAppSelector((state) => state.dashboard.master_data);

    useEffect(() => {
        Request.get({ url: API_URLS.DATA.get_field_survey(id) }).then((res) => {
            setData(res);
            setLoading(false);
        }).catch((err) => {
        })

    }, [])

    if (loading) return <span>Loading...</span>

    return (
        <Popup >
            <div style={{ width: "300px" }}>
                <Text size='sm' weight={800}>Field Survey</Text>
                <Text size='xs' weight={500}>Taken By {data?.name} on {moment(data?.added_on).format("DD MMM, yyyy")}</Text>
                <Divider my={5} />
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Repr Name:</Text>
                    <Text size='xs' weight={500}>{data?.repr_name}</Text>
                </Group>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Department:</Text>
                    <Text size='xs' weight={500}>{data?.department}</Text>
                </Group>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Designation:</Text>
                    <Text size='xs' weight={500}>{data?.m_designation_value}</Text>
                </Group>
                <Divider my={5} />
                <Text size='sm' weight={800}>Signal Details</Text>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Is Signal Available:</Text>
                    <Text size='xs' weight={500}>{data?.is_signal_available}</Text>
                </Group>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Is Signal Visible:</Text>
                    <Text size='xs' weight={500}>{data?.is_signal_visible}</Text>
                </Group>
                <Group spacing={'xs'}>
                    <Text size='xs' weight={700}>Is Signal Working:</Text>
                    <Text size='xs' weight={500}>{data?.is_signal_working}</Text>
                </Group>

            </div>
        </Popup>
    )
}

