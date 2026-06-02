import { useMemo } from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { Colors } from '@/constants/theme';

export interface ChartPoint {
  value: number;
  label: string;
}

interface OverloadChartProps {
  data: ChartPoint[];
  /** Suffix on the y-axis labels, e.g. " lb". */
  yAxisSuffix?: string;
}

/** Line chart for a single exercise metric over time. */
export function OverloadChart({ data, yAxisSuffix }: OverloadChartProps) {
  const chartWidth = Dimensions.get('window').width - 40;

  const spacing = useMemo(() => {
    if (data.length <= 1) return chartWidth - 80;
    return Math.max(36, (chartWidth - 80) / (data.length - 1));
  }, [data.length, chartWidth]);

  const maxValue = useMemo(() => {
    const max = Math.max(...data.map((d) => d.value), 0);
    return Math.ceil((max * 1.15) / 5) * 5 || 10;
  }, [data]);

  return (
    <View style={{ paddingVertical: 8 }}>
      <LineChart
        data={data}
        width={chartWidth - 40}
        height={200}
        spacing={spacing}
        initialSpacing={20}
        endSpacing={20}
        thickness={3}
        color={Colors.tint}
        dataPointsColor={Colors.tint}
        dataPointsRadius={4}
        maxValue={maxValue}
        noOfSections={4}
        yAxisColor={Colors.border}
        xAxisColor={Colors.border}
        rulesColor={Colors.border}
        rulesType="solid"
        yAxisTextStyle={{ color: Colors.muted, fontSize: 10 }}
        yAxisLabelSuffix={yAxisSuffix}
        xAxisLabelTextStyle={{ color: Colors.muted, fontSize: 9 }}
        textColor={Colors.text}
        curved
      />
    </View>
  );
}
