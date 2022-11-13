import { Center, createStyles, Grid, Group, Loader, Paper, SimpleGrid, Stack, Text } from '@mantine/core';
import {
    IconCoin, IconDiscount2,
    IconReceipt2, IconUserPlus
} from '@tabler/icons';
import { useEffect } from 'react';
import NLayout from '../components/layout';
import { useAppDispatch, useAppSelector } from '../store';
import { getDashboardData } from '../store/reducers/Dashboard.reducers';


export default function Dashboard() {

    const dashboardData = useAppSelector(state => state.dashboard);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getDashboardData());
    }, [])


    return (
        <>
            <NLayout title='Dashboard'>
                {
                    dashboardData.loading ?
                        <Center style={{ height: "100%" }}>
                            <Stack align={'center'}>
                                <Loader />
                                <Text>Preparing Data...</Text>
                            </Stack>
                        </Center>
                        :
                        // <StatsGrid data={[
                        //     {
                        //         title: "Total Complaints",
                        //         value: dashboardData.data?.complaint_feedback_count,
                        //         icon: 'coin',

                        //     },
                        //     {
                        //         title: "Total Appreciations",
                        //         value: dashboardData.data?.appreciation_feedback_count,
                        //         icon: 'discount',

                        //     },
                        //     {
                        //         title: "Total Field Surveys",
                        //         value: dashboardData.data?.field_survey_count,
                        //         icon: 'user',

                        //     },
                        //     {
                        //         title: "Total Users",
                        //         value: dashboardData.data?.department_user_count,
                        //         icon: 'receipt',

                        //     }
                        // ]} />
                        <Grid>
                            <Grid.Col p={0} m={0} lg={3} md={4} sm={6}><DCard title="Total Complaints" value={dashboardData.data?.complaint_feedback_count} /></Grid.Col>
                            <Grid.Col p={0} m={0} lg={3} md={4} sm={6}><DCard title="Total Appreciations" value={dashboardData.data?.appreciation_feedback_count} /></Grid.Col>
                            <Grid.Col p={0} m={0} lg={3} md={4} sm={6}><DCard title="Total Field Surveys" value={dashboardData.data?.field_survey_count} /></Grid.Col>
                            <Grid.Col p={0} m={0} lg={3} md={4} sm={6}><DCard title="Total Users" value={dashboardData.data?.department_user_count} /></Grid.Col>
                        </Grid>
                }
            </NLayout>
        </>
    )
}


function DCard({ title, value }: { title: string, value?: number }) {
    return (
        <Paper style={{ border: "1px solid rgba(0,0,0,.125)" }} p={0} m={10}>
            <Text py={5} px={10} style={{ background: "rgba(0,0,0,.03)" }}>{title}</Text>
            <Text py={5} px={10} weight={'bolder'} size="xl">{value}</Text>
        </Paper>
    )
}



// const useStyles = createStyles((theme) => ({
//     root: {
//         padding: theme.spacing.xl * 1.5,
//     },

//     value: {
//         fontSize: 24,
//         fontWeight: 700,
//         lineHeight: 1,
//     },

//     diff: {
//         lineHeight: 1,
//         display: 'flex',
//         alignItems: 'center',
//     },

//     icon: {
//         color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
//         back
//     },

//     title: {
//         fontWeight: 700,
//         textTransform: 'uppercase',
//     },
// }));

// const icons = {
//     user: IconUserPlus,
//     discount: IconDiscount2,
//     receipt: IconReceipt2,
//     coin: IconCoin,
// };

// interface StatsGridProps {
//     data: { title: string; icon: keyof typeof icons; value: number | undefined; }[];
// }

// export function StatsGrid({ data }: StatsGridProps) {
//     const { classes } = useStyles();
//     const stats = data.map((stat) => {
//         const Icon = icons[stat.icon];

//         return (
//             <Paper withBorder p="md" radius="md" key={stat.title}>
//                 <Group position="apart" pr={30} className="dashboard-card-content-icon-box">
//                     <Text size="xs" color="dimmed" className={classes.title}>
//                         {stat.title}
//                     </Text>
//                     <Icon className={classes.icon} size={22} stroke={1.5} />
//                 </Group>

//                 <Group align="flex-end" spacing="xs" mt={25}>
//                     <Text className={classes.value}>{stat.value}</Text>

//                 </Group>
//             </Paper>
//         );
//     });
//     return (
//         <div className={classes.root}>
//             <SimpleGrid
//                 cols={4}

//                 p={0}
//                 m={0}
//                 breakpoints={[
//                     { maxWidth: 'md', cols: 2 },
//                     { maxWidth: 'xs', cols: 1 },
//                 ]}
//             >
//                 {stats}
//             </SimpleGrid>
//         </div>
//     );
// }