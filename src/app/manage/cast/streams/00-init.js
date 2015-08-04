angular.module('control.manage.cast').run(function (ManageService) {
    ManageService.addItem({
        sectionId: 'cast',
        name: 'Streams',
        icon: 'music',
        order: 1,
        route: {
            subPathName: 'streams',
            name: 'streams',
            template: '/app/manage/cast/streams/streams.html',
            controller: 'StreamsCtrl',
            controllerAs: 'ctrl',
            title: 'Streams',
            resolve: /*@ngInject*/ {
                config: function (ConfigService) {
                    return ConfigService.getConfig();
                },
            },
        },
    });
});
