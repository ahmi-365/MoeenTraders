import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

// Original data source
const purchasesSalesData = {
  labels: ['01-Aug', '04-Aug', '07-Aug', '10-Aug', '13-Aug', '16-Aug', '19-Aug', '22-Aug', '25-Aug', '28-Aug', '31-Aug'],
  datasets: [
    {
      name: 'Purchases',
      data: [0, 0, 0, 0, 500, 0, 0, 0, 0, 0, 0],
      color: '#10B981', // Green
    },
    {
      name: 'Sales',
      data: [0, 0, 0, 0, 0, 180, 450, 0, 0, 0, 0],
      color: '#EF4444', // Red
    },
  ],
};

// --- Data transformation logic ---
const transformDataForChart = () => {
  const labels = purchasesSalesData.labels;
  const purchases = purchasesSalesData.datasets[0];
  const sales = purchasesSalesData.datasets[1];
  
  const combinedData: number[] = [];
  const barColors: string[] = [];

  labels.forEach((_, index) => {
    const purchaseValue = purchases.data[index];
    const saleValue = sales.data[index];
    combinedData.push(purchaseValue + saleValue);
    
    if (saleValue > 0) {
      barColors.push(sales.color);
    } else if (purchaseValue > 0) {
      barColors.push(purchases.color);
    } else {
      barColors.push('#E5E7EB');
    }
  });

  return {
    labels: labels,
    datasets: [
      {
        data: combinedData,
        colors: barColors.map(color => (opacity = 1) => color),
      },
    ],
  };
};

const chartData = transformDataForChart();

const chartConfig: AbstractChartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '0' },
  propsForBackgroundLines: { stroke: '#e0e0e0' },
  formatYLabel: (yValue) => `${String(yValue)}K`,
  barPercentage: 0.6,
};

interface TooltipData {
  visible: boolean;
  x: number;
  y: number;
  index: number;
  value: number;
  type: 'Sales' | 'Purchases' | '';
}

const PurchasesSalesReport: React.FC = () => {
  const [tooltip, setTooltip] = useState<TooltipData>({
    visible: false,
    x: 0,
    y: 0,
    index: 0,
    value: 0,
    type: '',
  });

  const handleDataPointClick = (data: { value: number; index: number; x: number; y: number; }) => {
    const { value, index, x, y } = data;

    if (value === 0) {
      setTooltip({ ...tooltip, visible: false });
      return;
    }
    
    if (tooltip.visible && tooltip.index === index) {
      setTooltip({ ...tooltip, visible: false });
      return;
    }

    const isSale = purchasesSalesData.datasets[1].data[index] > 0;
    const type = isSale ? 'Sales' : 'Purchases';

    setTooltip({ visible: true, x, y, value, index, type });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.reportContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Purchases & Sales Report</Text>
          <View style={styles.dateContainer}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.dateText}>August 2025</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.pkrLabelContainer}>
            <Text style={styles.pkrLabel}>PKR (in thousands)</Text>
          </View>
          
          {/* This wrapper is the key for correct tooltip positioning */}
          <View>
            <BarChart
              data={chartData}
              // The width is calculated to fit within the container's padding
              width={screenWidth - 48} // (12+12 from reportContainer) + (12+12 from chartContainer) = 48
              height={260}
              chartConfig={chartConfig}
              verticalLabelRotation={-45}
              withHorizontalLabels={true} 
              fromZero={true}
              showValuesOnTopOfBars={false}
              withInnerLines={true}
              style={styles.chart}
              withCustomBarColorFromData={true}
              flatColor={true}
              onDataPointClick={handleDataPointClick}
            />

            {tooltip.visible && (
              <View style={[styles.tooltip, { left: tooltip.x - 50, top: tooltip.y - 50 }]}>
                <Text style={styles.tooltipLabel}>{chartData.labels[tooltip.index]}</Text>
                <Text style={styles.tooltipText}>{`${tooltip.type}: ${tooltip.value}K`}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendText}>Purchases</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Sales</Text>
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
    padding: 12, // Affects total width
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
    paddingVertical: 16,
    paddingHorizontal: 12, // Added padding for chart spacing
    paddingBottom: 30, 
    position: 'relative',
    // --- FIX: REMOVED alignItems: 'center' ---
  },
  pkrLabelContainer: {
    position: 'absolute',
    left: -18, 
    top: 110,
    zIndex: 1,
    transform: [{ rotate: '-90deg' }],
  },
  pkrLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
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
    borderRadius: 2,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 10,
    // To prevent the tooltip from being too wide
    minWidth: 100, 
    alignItems: 'center',
  },
  tooltipLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
});

export default PurchasesSalesReport; 