import { createStyles, Group, Paper, SimpleGrid, Text } from '@mantine/core';
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

    useEffect(() => { dispatch(getDashboardData()) }, [])


    return (
        <>
            <NLayout title='Dashboard'>
                <StatsGrid data={[
                    {
                        title: "Total Complaints",
                        value: dashboardData.data?.complaint_feedback_count,
                        icon: 'coin',

                    },
                    {
                        title: "Total Appreciations",
                        value: dashboardData.data?.appreciation_feedback_count,
                        icon: 'discount',

                    },
                    {
                        title: "Total Field Surveys",
                        value: dashboardData.data?.field_survey_count,
                        icon: 'user',

                    },
                    {
                        title: "Total Users",
                        value: dashboardData.data?.department_user_count,
                        icon: 'receipt',

                    }
                ]} />
            </NLayout>
        </>
    )
}



const useStyles = createStyles((theme) => ({
    root: {
        padding: theme.spacing.xl * 1.5,
    },

    value: {
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1,
    },

    diff: {
        lineHeight: 1,
        display: 'flex',
        alignItems: 'center',
    },

    icon: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    title: {
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

const icons = {
    user: IconUserPlus,
    discount: IconDiscount2,
    receipt: IconReceipt2,
    coin: IconCoin,
};

interface StatsGridProps {
    data: { title: string; icon: keyof typeof icons; value: number | undefined; }[];
}

export function StatsGrid({ data }: StatsGridProps) {
    const { classes } = useStyles();
    const stats = data.map((stat) => {
        const Icon = icons[stat.icon];

        return (
            <Paper withBorder p="md" radius="md" key={stat.title}>
                <Group position="apart">
                    <Text size="xs" color="dimmed" className={classes.title}>
                        {stat.title}
                    </Text>
                    <Icon className={classes.icon} size={22} stroke={1.5} />
                </Group>

                <Group align="flex-end" spacing="xs" mt={25}>
                    <Text className={classes.value}>{stat.value}</Text>

                </Group>
            </Paper>
        );
    });
    return (
        <div className={classes.root}>
            <SimpleGrid
                cols={4}
                p={0}
                m={0}
                breakpoints={[
                    { maxWidth: 'md', cols: 2 },
                    { maxWidth: 'xs', cols: 1 },
                ]}
            >
                {stats}
            </SimpleGrid>
        </div>
    );
}