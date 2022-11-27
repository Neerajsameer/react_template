import { Card, Center, Divider, Grid, Group, Loader, Modal, Space, Stack, Text } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconClock, IconEye, IconFileAnalytics, IconMessage, IconUserCircle } from "@tabler/icons";
import { ColumnType } from "antd/lib/table";
import moment from "moment";
import { useEffect, useState } from "react";
import GDropDown from "../components/dropdown";
import NLayout from "../components/layout";
import NTable from "../components/Table/table";
import { API_URLS } from "../constants/api_urls";
import { feedBackTypesList } from "../constants/constants";
import NBadge from "../framework/NBadge";
import { useAppDispatch, useAppSelector } from "../store";
import { getFeedbacks, setFeedbackData, setFeedbackFilters } from "../store/reducers/feedbacks.reducer";
import { Request } from "../utils/functions.utils";

export default function FeedBackPage() {
  const dispatch = useAppDispatch();
  const feedbackData = useAppSelector((state) => state.feedbacks);

  useEffect(() => {
    dispatch(getFeedbacks());
  }, [feedbackData.filters]);

  const columns: ColumnType<any>[] = [
    { fixed: true, title: "S No", dataIndex: "s_no", key: "s_no", width: "60px", align: "center" },
    {
      fixed: true,
      title: "Feedback ID",
      dataIndex: "s_feedback_id",
      key: "s_feedback_id",
      width: "140px",
      align: "center",
    },
    { fixed: true, title: "User Name", dataIndex: "added_by", key: "added_by" },
    {
      title: "Created At",
      dataIndex: "added_on",
      key: "added_on",
      render: (value, record) => {
        return <span>{moment(value).format("DD MMM yyyy, hh:mm A")}</span>;
      },
    },
    {
      title: "Feedback Type",
      dataIndex: "feedback_type",
      key: "feedback_type",
      render: (value, record) => {
        return <NBadge title={value === 1 ? "Complaint" : "Appreciation"} />;
      },
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
      render: (value, record) => {
        return <span>{value === "Others" ? record.m_feedback_other : value}</span>;
      },
    },
    { title: "Comment", dataIndex: "comment", key: "comment" },
    {
      fixed: "right",
      title: "More",
      dataIndex: "more",
      key: "more",
      render: (value, record) => {
        return <IconEye onClick={() => dispatch(setFeedbackData(record))} />;
      },
    },
  ];

  return (
    <NLayout title="Feedbacks">
      <Grid>
        <Grid.Col span={4}>
          <DatePicker
            label="From Date"
            value={feedbackData.filters.from_date}
            name="from_date"
            required={false}
            onChange={(date) => {
              dispatch(setFeedbackFilters({ from_date: date }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <DatePicker
            label="From Date"
            value={feedbackData.filters.to_date}
            name="from_date"
            required={false}
            onChange={(date) => {
              dispatch(setFeedbackFilters({ to_date: date }));
            }}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <GDropDown
            data={feedBackTypesList.map((item, i) => ({ label: item, value: i.toString() }))}
            label="Feedback Type"
            name="feedback_type"
            onChange={(value) => {
              dispatch(setFeedbackFilters({ feedback_type: value }));
            }}
            value={(feedbackData.filters.feedback_type ?? 0)?.toString() as any}
          />
        </Grid.Col>
      </Grid>
      <Space h={24} />
      <NTable
        columns={columns}
        data={feedbackData.data}
        loading={feedbackData.loading}
        totalCount={feedbackData.data.length}
      />
      <Space h={30} />

      <Modal
        opened={!!feedbackData.feedback_data}
        onClose={() => {
          dispatch(setFeedbackData(null));
        }}
        title="Feedback Details"
        padding="xl"
        size="xl"
      >
        <PhotosViewer />
      </Modal>
    </NLayout>
  );
}

function PhotosViewer() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const feedback_data = useAppSelector((state) => state.feedbacks.feedback_data);
  useEffect(() => {
    Request.get({ url: API_URLS.DATA.feedback_images(feedback_data?.s_feedback_id as any) }).then((res) => {
      setPhotos(res.filter((x: any) => x.img));
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <Center>
        <Loader />
      </Center>
    );

  return (
    <div>
      {photos.length == 0 ? (
        <Text size={"xs"}>No Photos Available</Text>
      ) : (
        photos.map((item, i) => {
          return (
            <Stack spacing={10}>
              <Card withBorder shadow={"sm"}>
                <Group position="apart">
                  <Stack p={0} m={0}>
                    <Text weight={"bold"}>{feedback_data?.feedback}</Text>
                    <Group>
                      <IconMessage size={20} />
                      <Text size={"xs"}>{feedback_data?.comment}</Text>
                    </Group>
                  </Stack>
                  <Divider orientation="vertical" />
                  <Stack spacing={5}>
                    <Group>
                      <IconFileAnalytics size={18} />
                      <NBadge title={feedback_data?.feedback_type === 1 ? "Complaint" : "Appreciation"} />
                    </Group>
                    <Group>
                      <IconUserCircle size={18} />
                      <Text size={"xs"}>{feedback_data?.added_by}</Text>
                    </Group>
                    <Group>
                      <IconClock size={18} />
                      <Text size={"xs"}>{moment(feedback_data?.added_on).format("DD MMM yyyy, hh:mm A")}</Text>
                    </Group>
                  </Stack>
                </Group>
              </Card>
              <Text mt={20} weight={"bold"}>
                Photos
              </Text>
              <Stack spacing={5}>
                <img
                  src={`data:image/png;base64, ${item.img}`}
                  height={170}
                  width={170}
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                />
                <Text size="sm">
                  {item.latitude} , {item.longitude}
                </Text>
                <Text size="xs">{moment(feedback_data?.added_on).format("DD MMM, YYYY HH:MM a")}</Text>
              </Stack>
            </Stack>
          );
        })
      )}
    </div>
  );
}
