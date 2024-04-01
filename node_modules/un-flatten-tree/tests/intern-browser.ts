export * from './intern';

export const environments = [
    {
        browserName: 'Safari',
        appiumVersion: '1.6.3',
        recordVideo: false,
        recordScreenshots: false,
        deviceName: 'iPhone Simulator',
        deviceOrientation: 'portrait',
        platformVersion: ['9.3', '10.2'],
        platformName: 'iOS'
    },
    {
        browserName: 'Browser',
        appiumVersion: '1.6.3',
        recordVideo: false,
        recordScreenshots: false,
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait',
        platformVersion: ['5.1', '6.0'],
        platformName: 'Android'
    },
    {
        browserName: 'chrome',
        version: ['56', '57'],
        platform: ['Windows 10'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'firefox',
        version: ['51', '52'],
        platform: ['Windows 10'],
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'MicrosoftEdge',
        version: ['13', '14'],
        platform: 'Windows 10',
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'internet explorer',
        version: ['10', '11'],
        platform: 'Windows 7',
        recordVideo: false,
        recordScreenshots: false
    },
    {
        browserName: 'safari',
        version: ['9', '10'],
        platform: 'OS X 10.11',
        recordVideo: false,
        recordScreenshots: false
    }
];

export const tunnel = 'SauceLabsTunnel';

export const maxConcurrency = 5;

export const reporters = ['Runner'];
