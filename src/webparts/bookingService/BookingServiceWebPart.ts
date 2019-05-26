import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'BookingServiceWebPartStrings';
import BookingService from './components/BookingService';
import { IBookingServiceProps } from './components/IBookingServiceProps';
import configureStore from './components/store';
import * as actions from './components/actions';

export interface IBookingServiceWebPartProps {
  description: string;
}

export default class BookingServiceWebPart extends BaseClientSideWebPart<IBookingServiceWebPartProps> {

  public render(): void {
    const reduxStore = configureStore();

    const element: React.ReactElement<IBookingServiceProps > = React.createElement(
      BookingService,
      {
        description: this.properties.description,
        store: reduxStore
      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
