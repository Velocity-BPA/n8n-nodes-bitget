/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class BitgetApi implements ICredentialType {
  name = 'bitgetApi';
  displayName = 'Bitget API';
  documentationUrl = 'https://www.bitget.com/api-doc/common/intro';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Bitget API Key from the API management dashboard',
    },
    {
      displayName: 'Secret Key',
      name: 'secretKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'Your Bitget API Secret Key',
    },
    {
      displayName: 'Passphrase',
      name: 'passphrase',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'The passphrase you set when creating the API key',
    },
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Demo (Paper Trading)',
          value: 'demo',
        },
      ],
      default: 'production',
      description: 'Choose between production and demo/paper trading environment',
    },
  ];
}
