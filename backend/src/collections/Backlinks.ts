import { CollectionConfig } from 'payload';

export const Backlinks: CollectionConfig = {
  slug: 'backlinks',
  admin: {
    useAsTitle: 'domain',
    description: 'Manages domain backlink information and marketplace data',
    group: 'Domain Management',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    // Domain Information
    {
      name: 'domain',
      type: 'text',
      required: true,
      index: true,
      unique: true,
      validate: (value) => {
        const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
        if (!domainRegex.test(value)) {
          return 'Please enter a valid domain name';
        }
        return true;
      },
      admin: {
        description: 'The primary domain name being tracked',
      },
    },

    // Marketplace Information
    {
      name: 'marketplaces',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'List of marketplaces where the domain is listed',
      },
      fields: [
        {
          name: 'marketplace_source',
          type: 'select',
          required: true,
          options: [
            { label: 'GoDaddy', value: 'godaddy' },
            { label: 'Sedo', value: 'sedo' },
            { label: 'Afternic', value: 'afternic' },
            { label: 'Dan', value: 'dan' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            description: 'Price in USD',
            step: 0.01,
          },
        },
        {
          name: 'last_updated',
          type: 'date',
          admin: {
            description: 'When the marketplace data was last updated',
          },
          defaultValue: () => new Date().toISOString(),
        },
      ],
    },

    // Domain Metrics
    {
      name: 'metrics',
      type: 'group',
      admin: {
        description: 'Key domain metrics and statistics',
      },
      fields: [
        {
          name: 'rd',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of referring domains',
          },
        },
        {
          name: 'tf',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Trust Flow score (0-100)',
          },
        },
        {
          name: 'cf',
          type: 'number',
          min: 0,
          max: 100,
          admin: {
            description: 'Citation Flow score (0-100)',
          },
        },
        {
          name: 'ttf',
          type: 'text',
          admin: {
            description: 'Topical Trust Flow categories',
          },
        },
        {
          name: 'backlinks',
          type: 'number',
          min: 0,
          admin: {
            description: 'Total number of backlinks',
          },
        },
      ],
    },

    // Referrer Statistics
    {
      name: 'referrers',
      type: 'group',
      admin: {
        description: 'Detailed referrer statistics',
      },
      fields: [
        {
          name: 'ref_ips',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of unique referring IP addresses',
          },
        },
        {
          name: 'ref_subnets',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of unique referring subnets',
          },
        },
        {
          name: 'ref_edu',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of .edu referring domains',
          },
        },
        {
          name: 'ref_gov',
          type: 'number',
          min: 0,
          admin: {
            description: 'Number of .gov referring domains',
          },
        },
      ],
    },

    // Language Information
    {
      name: 'language_info',
      type: 'group',
      admin: {
        description: 'Language-related information',
      },
      fields: [
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'French', value: 'fr' },
            { label: 'German', value: 'de' },
            { label: 'Other', value: 'other' },
          ],
          admin: {
            description: 'Primary language of the domain',
          },
        },
        {
          name: 'ref_lang',
          type: 'text',
          admin: {
            description: 'Languages of referring domains',
          },
        },
      ],
    },

    // Dates
    {
      name: 'dates',
      type: 'group',
      admin: {
        description: 'Important dates',
      },
      fields: [
        {
          name: 'expiry_date',
          type: 'date',
          admin: {
            description: 'Domain expiration date',
          },
        },
        {
          name: 'date_fetched',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            description: 'When this data was last fetched',
            readOnly: true,
          },
        },
      ],
    },
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure date_fetched is updated on every change
        return {
          ...data,
          date_fetched: new Date().toISOString(),
        };
      },
    ],
  },

  versions: {
    drafts: true,
  },
};
