export default class ConfigService {
    /*@ngInject*/
    constructor ($http, ENV, promiseCache, $rootScope, $q) {
      this.invalidateCache = function () {
        promiseCache.remove("castConfig");
      };

      this.getConfig = function () {
        const username = $rootScope.service.username;
        if ($rootScope.service.group.toLowerCase().indexOf("nodes") === -1) {
          $rootScope.$broadcast("cast-only-route");
          return $q.reject("selected service is a non-Cast service");
        }
        return promiseCache({
          promise: function () {
            return $http
                        .get(ENV.apiEndpoint + "/control/cast/configuration/" + username)
                        .then(function (response) {
                          return response.data;
                        });
          },
          key: "castConfig",
          ttl: -1,
        });
      };

        /**
         * Get an array of countries from /app/common/iso-3166-2-countries.json
         * @return {Promise}
         */
      this.getCountries = () => require("../../common/iso-3166-2-countries.json");

        /**
         * Save GeoLock configuration for a Cast service.
         * @param  {Object}  config    GeoLock configuration object
         *                             { enabled: true/false, mode: "whitelist"/"blacklist",
         *                               countryCodes: ["BE", "FR", "GB"] }
         * @return {Promise}
         */
      this.saveGeoLockConfig = (config) => {
        const username = $rootScope.service.username;
        return $http.put(`${ENV.apiEndpoint}/control/cast/geolock/${username}`, config)
                .then(response => response.data);
      };

        /**
         * Save the streams config
         * @param {Array} config - An array of streams
         */
      this.saveStreamsConfig = (config) => {
        const username = $rootScope.service.username;
        return $http.put(`${ENV.apiEndpoint}/control/cast/streams/${username}`, config)
                .then(response => response.data);
      };

      $rootScope.$on("selected-service-changed", this.invalidateCache);
      $rootScope.$on("invalidate-cast-config-cache", this.invalidateCache);
    }
}