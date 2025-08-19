import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

// Sample data for Sales & Sales Return Report
const salesReturnData = {
  labels: ['01-Aug', '04-Aug', '07-Aug', '10-Aug', '13-Aug', '16-Aug', '19-Aug', '22-Aug', '25-Aug', '28-Aug', '31-Aug'],
  datasets: [
    {
      data: [0, 0, 0, 0, 0, 140, 380, 0, 0, 0, 0], // Sales (in thousands)
      color: () => '#10B981', // Teal color
      strokeWidth: 3,
    },
    {
      data: [0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 20], // Returns (in thousands)
      color: () => '#EF4444', // Red color
      strokeWidth: 3,
    }
  ],
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '0',
  },
  propsForBackgroundLines: {
    strokeDasharray: '',
    stroke: '#e0e0e0',
    strokeWidth: 1,
  },
  formatYLabel: (yValue) => `${yValue}K`,
  fillShadowGradient: 'transparent',
  fillShadowGradientOpacity: 0,
};

const SalesReturnReport = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.reportContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Sales & Sales Return Report</Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.dateText}>August 2025</Text>
          </View>
        </View>

        {/* Chart Container */}
        <View style={styles.chartContainer}>
          {/* PKR Label */}
          <View style={styles.pkrLabelContainer}>
            <Text style={styles.pkrLabel}>PKR</Text>
          </View>

          {/* Chart */}
          <View style={styles.chartWrapper}>
            <LineChart
              data={salesReturnData}
              width={screenWidth - 50}
              height={260}
              chartConfig={chartConfig}
              verticalLabelRotation={-45}
              fromZero={true}
              withInnerLines={true}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              style={styles.chart}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.circleColor, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Sales</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, styles.circleColor, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Sales Return</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  reportContainer: {
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
    borderRadius: 8,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    marginLeft: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 8,
    position: 'relative',
  },
  pkrLabelContainer: {
    position: 'absolute',
    left: 10,
    top: '50%',
    zIndex: 1,
    transform: [{ rotate: '-90deg' }],
  },
  pkrLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  chartWrapper: {
    alignItems: 'center',
    marginLeft: 5,
  },
  chart: {
    borderRadius: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  circleColor: {
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

export default SalesReturnReport;