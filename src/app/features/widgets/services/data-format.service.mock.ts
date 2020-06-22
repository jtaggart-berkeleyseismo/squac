import { BehaviorSubject } from 'rxjs';
import { Widget } from '../../../core/models/widget';
import { Measurement } from '../models/measurement';


export class MockDataFormatService {

  testMeasurement: Measurement = new Measurement(
    1,
    1,
    1,
    1,
    0,
    new Date(),
    new Date ()
  );
  formattedData = new BehaviorSubject<any>(null);

  fetchData(widget: Widget) {
    this.formattedData.next(
      { 1 :
        {
          1 : [this.testMeasurement]
        }
      }
    );
  }
}