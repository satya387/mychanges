export const API_STATUS_CODE = {
  conflict: 409,
  badRequest: 400,
  preConditionFailed: 412,
  internalServerError: 500,
  forbidden: 403,
  notfound: 404,
  unauthorised: 401,
};

export const SETTINGS_MENUS = [
  {
    remixIcon: 'ri-user-star-fill',
    name: 'Roles',
    routeLink: '/roles',
  },
  {
    remixIcon: 'ri-profile-fill',
    name: 'Default Sections',
    routeLink: '/default-section',
  },
  {
    remixIcon: 'ri-stack-fill',
    name: 'Sections',
    routeLink: '/section',
  },
  {
    remixIcon: 'ri-layout-masonry-fill',
    name: 'Tiles',
    routeLink: '/tiles',
  },
  {
    remixIcon: 'ri-group-fill',
    name: 'Users',
    routeLink: '/users',
  },
  {
    remixIcon: 'ri-share-forward-fill',
    name: 'Assign',
    routeLink: '/assign',
  },
  {
    remixIcon: 'ri-file-paper-2-fill',
    name: 'Contents',
    routeLink: '/content',
  },
];

export const settings = {
  'limit': 10,
  'offset': 1,
  'link_pattern': '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
  'URL_PATTERN': '^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$',
  'roleName': 'Admin',
  'acceptImageTypes': 'image/jpeg,image/jpg,image/png,image/svg+xml,application/svg+xml',
  'acceptIconImageTypes': 'image/x-icon,image/icns,image/png,image/svg+xml,application/svg+xml',
  'minLength': 5,
  'maxLength': 50
}

export const Pagination_Items_Per_Page = [5, 10, 15, 20, 100];

export const Banner_slides = [{
  "contentId": 4,
  "bannerImageUrl": "https://emidsstorageaccount.blob.core.windows.net/blobcontainer/ModuleImage/2/Applye_Laptop%20%282%29.jpg?sv=2021-04-10&se=2022-05-27T12%3A52%3A56Z&sr=b&sp=r&sig=Zz4khbfDTE6qSI9u5AQgV0slGzn6z2KBTeyxo3JHRvI%3D",
  "content": "Tile 5"
}, {
  "contentId": 9,
  "bannerImageUrl": "https://emidsstorageaccount.blob.core.windows.net/blobcontainer/ModuleImage/2/Applye_Laptop%20%282%29.jpg?sv=2021-04-10&se=2022-05-27T12%3A52%3A56Z&sr=b&sp=r&sig=Zz4khbfDTE6qSI9u5AQgV0slGzn6z2KBTeyxo3JHRvI%3D",
  "content": "<p><strong>cadacda</strong></p>"
}, {
  "contentId": 10,
  "bannerImageUrl": "https://emidsstorageaccount.blob.core.windows.net/blobcontainer/ModuleImage/2/Applye_Laptop%20%282%29.jpg?sv=2021-04-10&se=2022-05-27T12%3A52%3A56Z&sr=b&sp=r&sig=Zz4khbfDTE6qSI9u5AQgV0slGzn6z2KBTeyxo3JHRvI%3D",
  "content": "<p><i><strong>Test Content</strong></i></p>"
}]

export const Image_Dimensions = [{
  Id: 1,
  dimensions: '1920px by 460px',
  styleDimensions: '1920px X 460 px',
  orientation: 'Desktop',
  width: 1920,
  height: 460
}, {
  Id: 2,
  dimensions: '1024px by 385px',
  styleDimensions: '1024px X 385px',
  orientation: 'Tablet (Landscape)',
  width: 1024,
  height: 385
}, {
  Id: 3,
  dimensions: '768px by 400px',
  styleDimensions: '768px X 400px',
  orientation: 'Tablet (Portrait)',
  width: 768,
  height: 400
}, {
  Id: 4,
  dimensions: '390px by 412px',
  styleDimensions: '390px X 412px',
  orientation: 'Mobile',
  width: 390,
  height: 412
}]

export const CONFIRM_VALUES = [
  {
    Id: 1,
    Name: 'Yes',
    Value: true
  }, {
    Id: 2,
    Name: 'No',
    Value: false
  }
]

export const PAYMENT_TYPE = [
  {
    Id: 1,
    Name: 'Annual',
  }, {
    Id: 2,
    Name: 'Hourly'
  }, {
    Id: 3,
    Name: 'Monthly'
  }
]

export const BILLING_FREQUENCY = [
  {
    Id: 1,
    Name: 'Hourly',
  }, {
    Id: 2,
    Name: 'Monthly'
  }
]

export const CURRENCY_TYPE = [
  {
    Id: 1,
    Name: 'INR',
  }, {
    Id: 2,
    Name: 'USD'
  }
]

export const BILLING_TYPE = [
  {
    Id: 1,
    Name: 'Billable',
    Value: true
  }, {
    Id: 2,
    Name: 'Non-billable',
    Value: false
  }
]

export const EMPLOYMENT_TYPE = [
  {
    Id: 1,
    Name: 'Any',
  }, {
    Id: 2,
    Name: 'Contract'
  }, {
    Id: 3,
    Name: 'Contract to Hire',
  }, {
    Id: 4,
    Name: 'Full Time Employee'
  }
]

export const EDUCATION_TYPE = [
  {
    Id: 1,
    Name: 'Any',
  }, {
    Id: 2,
    Name: 'Bachelors'
  }, {
    Id: 3,
    Name: 'Masters',
  }
]

export const PLACEMENT_TYPE = [
  {
    Id: 1,
    Name: 'New',
    Value: false
  }, {
    Id: 2,
    Name: 'Backfill',
    Value: true
  }
]

export const SERVICE_TYPE = [
  {
    Id: 1,
    Name: 'Managed Services',
  }, {
    Id: 2,
    Name: 'Staffing'
  }
]

export const AUTHORIZATION_STATUS = [
  {
    Id: 1,
    Name: 'Any',
  }, {
    Id: 2,
    Name: 'H1'
  }, {
    Id: 3,
    Name: 'OPT EAD',
  }, {
    Id: 4,
    Name: 'GC'
  }, {
    Id: 5,
    Name: 'USC'
  }
]

export const BU_PRACTISE = [
  {
    Id: 1,
    Name: 'Life Sciences',
  }, {
    Id: 2,
    Name: 'Payer'
  }, {
    Id: 3,
    Name: 'Provider',
  }, {
    Id: 4,
    Name: 'Others'
  }
]

export const SKILLS_LIST = [
  {
    Id: 1,
    Name: 'Skill 1',
    selectedSkill: null,
    selectedOption: null
  }, {
    Id: 2,
    Name: 'Skill 2',
    selectedSkill: null,
    selectedOption: null
  }, {
    Id: 3,
    Name: 'Skill 3',
    selectedSkill: null,
    selectedOption: null
  }, {
    Id: 4,
    Name: 'Skill 4',
    isMandatory: true
  }, {
    Id: 5,
    Name: 'Skill 5',
    selectedSkill: null,
    selectedOption: null
  }
]
