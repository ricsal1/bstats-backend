import { Injectable } from '@nestjs/common';
import { ChartDataProcessor } from './interfaces/chart-data-processor.interface';
import { Chart } from '../../charts/interfaces/charts/chart.interface';
import { SubmitDataCustomChartDto } from '../dto/submit-data.dto';
import { ChartsService } from '../../charts/charts.service';
import { isBarChart } from '../../charts/interfaces/charts/advanced-bar-chart.interface';

@Injectable()
export class BarChartDataProcessor implements ChartDataProcessor {
  constructor(private chartsService: ChartsService) {}

  async processData(
    chart: Chart,
    customChartData: SubmitDataCustomChartDto,
    tms2000: number,
  ): Promise<any> {
    if (
      typeof customChartData.data !== 'object' ||
      typeof customChartData.data.values !== 'object' ||
      !isBarChart(chart)
    ) {
      return;
    }
    const values = Object.keys(customChartData.data.values)
      .filter((category) =>
        Array.isArray(customChartData.data.values[category]),
      )
      .map((category) => ({
        category,
        barValues: customChartData.data.values[category] as number[],
      }))
      .filter(({ barValues }) =>
        barValues.every((value) => typeof value === 'number'),
      );

    return this.chartsService.updateBarChartData(chart.id, tms2000, values);
  }
}
