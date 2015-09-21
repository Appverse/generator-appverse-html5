/*
 Copyright (c) 2015 GFT Appverse, S.L., Sociedad Unipersonal.
 This Source Code Form is subject to the terms of the Appverse Public License
 Version 2.0 (â€œAPL v2.0â€?). If a copy of the APL was not distributed with this
 file, You can obtain one at http://www.appverse.mobi/licenses/apl_v2.0.pdf. [^]
 Redistribution and use in source and binary forms, with or without modification,
 are permitted provided that the conditions of the AppVerse Public License v2.0
 are met.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. EXCEPT IN CASE OF WILLFUL MISCONDUCT OR GROSS NEGLIGENCE, IN NO EVENT
 SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT(INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';

/*
 * Controller Advanced_componentsController for Advanced_components.
 * Pay attention to injection of dependencies (factories, entities and Angular objects).
 */
angular.module('App.Controllers')

.controller('ComponentsController', ['$scope', '$modal', '$log', '$http', '$timeout',
            function ($scope, $modal, $log, $http, $timeout) {
            $scope.name = 'Components';

            /*COLLAPSIBLE MENU*/
            $scope.oneAtATime = true;
            $scope.groups = [
                {
                    title: 'Dynamic Group Header - 1',
                    content: 'Dynamic Group Body - 1'
                    },
                {
                    title: 'Dynamic Group Header - 2',
                    content: 'Dynamic Group Body - 2'
                    }
                ];

            $scope.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };
            $scope.status2 = {
                isFirstOpen: true,
                isFirstDisabled: false
            };
            /*EO COLLAPSIBLE MENU*/

            /*CAROUSEL*/
            $scope.myInterval = 5000;
            var slides = $scope.slides = [];
            $scope.addSlide = function () {
                var newWidth = 600 + slides.length + 1;
                slides.push({
                    image: 'http://placekitten.com/' + newWidth + '/300',
                    text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' + ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
                });
            };
            for (var i = 0; i < 4; i++) {
                $scope.addSlide();
            }
            /*EO CAROUSEL*/

            /*CALENDAR*/
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            $scope.disabled = function (date, mode) {
                return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
            };

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                class: 'datepicker',
                showWeeks: false,
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            var afterTomorrow = new Date();
            afterTomorrow.setDate(tomorrow.getDate() + 2);
            $scope.events = [
                {
                    date: tomorrow,
                    status: 'full'
                            },
                {
                    date: afterTomorrow,
                    status: 'partially'
                            }
                        ];

            $scope.getDayClass = function (date, mode) {
                if (mode === 'day') {
                    var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                    for (var i = 0; i < $scope.events.length; i++) {
                        var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                        if (dayToCheck === currentDay) {
                            return $scope.events[i].status;
                        }
                    }
                }

                return '';
            };
            /*EO CALENDAR*/

            /*MODALS*/
            $scope.animationsEnabled = true;

            $scope.items = ['item1', 'item2', 'item3'];

            $scope.openModal = function (size) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'views/modal-template.html',
                    controller: 'ModalController',
                    size: size,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };


            /*EO MODALS*/

            /*PAGINATION*/
            $scope.totalItems = 64;
            $scope.currentPage = 4;

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.maxSize = 5;
            $scope.bigTotalItems = 175;
            $scope.bigCurrentPage = 1;
            /*EO PAGINATION*/

            /*TOOLTIPS*/
            $scope.dynamicTooltip = 'Hello, World!';
            $scope.dynamicTooltipText = 'tooltip';
            /*EO TOOLTIPS*/

            /*TABS*/
            $scope.tabs = [
                {
                    title: 'Dynamic Title 1',
                    content: 'Dynamic content 1'
                },
                {
                    title: 'Dynamic Title 2',
                    content: 'Dynamic content 2',
                    disabled: true
                }
                ];
            setTimeout(function () {
                $('.tab-content').addClass('myslide');
            }, 500);
            /*EO TABS*/

            /*UI-SELECT*/
            $scope.disabled = undefined;

            $scope.enable = function () {
                $scope.disabled = false;
            };

            $scope.disable = function () {
                $scope.disabled = true;
            };

            $scope.clear = function () {
                $scope.person.selected = undefined;
                $scope.address.selected = undefined;
                $scope.country.selected = undefined;
            };


            $scope.address = {};
            $scope.refreshAddresses = function (address) {
                var params = {
                    address: address,
                    sensor: false
                };
                return $http.get(
                    'http://maps.googleapis.com/maps/api/geocode/json', {
                        params: params
                    }
                ).then(function (response) {
                    $scope.addresses = response.data.results
                });
            };
            $scope.someGroupFn = function (item) {

                if (item.name[0] >= 'A' && item.name[0] <= 'M')
                    return 'From A - M';

                if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                    return 'From N - Z';

            };

            $scope.personAsync = {
                selected: "wladimir@email.com"
            };
            $scope.peopleAsync = [];

            $timeout(function () {
                $scope.peopleAsync = [
                    {
                        name: 'Adam',
                        email: 'adam@email.com',
                        age: 12,
                        country: 'United States'
                    },
                    {
                        name: 'Amalie',
                        email: 'amalie@email.com',
                        age: 12,
                        country: 'Argentina'
                    },
                    {
                        name: 'Estefanía',
                        email: 'estefania@email.com',
                        age: 21,
                        country: 'Argentina'
                    },
                    {
                        name: 'Adrian',
                        email: 'adrian@email.com',
                        age: 21,
                        country: 'Ecuador'
                    },
                    {
                        name: 'Wladimir',
                        email: 'wladimir@email.com',
                        age: 30,
                        country: 'Ecuador'
                    },
                    {
                        name: 'Samantha',
                        email: 'samantha@email.com',
                        age: 30,
                        country: 'United States'
                    },
                    {
                        name: 'Nicole',
                        email: 'nicole@email.com',
                        age: 43,
                        country: 'Colombia'
                    },
                    {
                        name: 'Natasha',
                        email: 'natasha@email.com',
                        age: 54,
                        country: 'Ecuador'
                    },
                    {
                        name: 'Michael',
                        email: 'michael@email.com',
                        age: 15,
                        country: 'Colombia'
                    },
                    {
                        name: 'Nicolás',
                        email: 'nicole@email.com',
                        age: 43,
                        country: 'Colombia'
                    }
                    ];
            }, 3000);

            $scope.counter = 0;
            $scope.someFunction = function (item, model) {
                $scope.counter++;
                $scope.eventResult = {
                    item: item,
                    model: model
                };
            };

            $scope.person = {};
            $scope.people = [
                {
                    name: 'Adam',
                    email: 'adam@email.com',
                    age: 12,
                    country: 'United States'
                },
                {
                    name: 'Amalie',
                    email: 'amalie@email.com',
                    age: 12,
                    country: 'Argentina'
                },
                {
                    name: 'Estefanía',
                    email: 'estefania@email.com',
                    age: 21,
                    country: 'Argentina'
                },
                {
                    name: 'Adrian',
                    email: 'adrian@email.com',
                    age: 21,
                    country: 'Ecuador'
                },
                {
                    name: 'Wladimir',
                    email: 'wladimir@email.com',
                    age: 30,
                    country: 'Ecuador'
                },
                {
                    name: 'Samantha',
                    email: 'samantha@email.com',
                    age: 30,
                    country: 'United States'
                },
                {
                    name: 'Nicole',
                    email: 'nicole@email.com',
                    age: 43,
                    country: 'Colombia'
                },
                {
                    name: 'Natasha',
                    email: 'natasha@email.com',
                    age: 54,
                    country: 'Ecuador'
                },
                {
                    name: 'Michael',
                    email: 'michael@email.com',
                    age: 15,
                    country: 'Colombia'
                },
                {
                    name: 'Nicolás',
                    email: 'nicolas@email.com',
                    age: 43,
                    country: 'Colombia'
                }
                ];

            $scope.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

            $scope.multipleDemo = {};
            $scope.multipleDemo.colors = ['Blue', 'Red'];
            $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
            $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
            $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];

            $scope.country = {};
            $scope.countries = [ // Taken from https://gist.github.com/unceus/6501985
                {
                    name: 'Afghanistan',
                    code: 'AF'
                },
                {
                    name: 'Åland Islands',
                    code: 'AX'
                },
                {
                    name: 'Albania',
                    code: 'AL'
                },
                {
                    name: 'Algeria',
                    code: 'DZ'
                },
                {
                    name: 'American Samoa',
                    code: 'AS'
                },
                {
                    name: 'Andorra',
                    code: 'AD'
                },
                {
                    name: 'Angola',
                    code: 'AO'
                },
                {
                    name: 'Anguilla',
                    code: 'AI'
                },
                {
                    name: 'Antarctica',
                    code: 'AQ'
                },
                {
                    name: 'Antigua and Barbuda',
                    code: 'AG'
                },
                {
                    name: 'Argentina',
                    code: 'AR'
                },
                {
                    name: 'Armenia',
                    code: 'AM'
                },
                {
                    name: 'Aruba',
                    code: 'AW'
                },
                {
                    name: 'Australia',
                    code: 'AU'
                },
                {
                    name: 'Austria',
                    code: 'AT'
                },
                {
                    name: 'Azerbaijan',
                    code: 'AZ'
                },
                {
                    name: 'Bahamas',
                    code: 'BS'
                },
                {
                    name: 'Bahrain',
                    code: 'BH'
                },
                {
                    name: 'Bangladesh',
                    code: 'BD'
                },
                {
                    name: 'Barbados',
                    code: 'BB'
                },
                {
                    name: 'Belarus',
                    code: 'BY'
                },
                {
                    name: 'Belgium',
                    code: 'BE'
                },
                {
                    name: 'Belize',
                    code: 'BZ'
                },
                {
                    name: 'Benin',
                    code: 'BJ'
                },
                {
                    name: 'Bermuda',
                    code: 'BM'
                },
                {
                    name: 'Bhutan',
                    code: 'BT'
                },
                {
                    name: 'Bolivia',
                    code: 'BO'
                },
                {
                    name: 'Bosnia and Herzegovina',
                    code: 'BA'
                },
                {
                    name: 'Botswana',
                    code: 'BW'
                },
                {
                    name: 'Bouvet Island',
                    code: 'BV'
                },
                {
                    name: 'Brazil',
                    code: 'BR'
                },
                {
                    name: 'British Indian Ocean Territory',
                    code: 'IO'
                },
                {
                    name: 'Brunei Darussalam',
                    code: 'BN'
                },
                {
                    name: 'Bulgaria',
                    code: 'BG'
                },
                {
                    name: 'Burkina Faso',
                    code: 'BF'
                },
                {
                    name: 'Burundi',
                    code: 'BI'
                },
                {
                    name: 'Cambodia',
                    code: 'KH'
                },
                {
                    name: 'Cameroon',
                    code: 'CM'
                },
                {
                    name: 'Canada',
                    code: 'CA'
                },
                {
                    name: 'Cape Verde',
                    code: 'CV'
                },
                {
                    name: 'Cayman Islands',
                    code: 'KY'
                },
                {
                    name: 'Central African Republic',
                    code: 'CF'
                },
                {
                    name: 'Chad',
                    code: 'TD'
                },
                {
                    name: 'Chile',
                    code: 'CL'
                },
                {
                    name: 'China',
                    code: 'CN'
                },
                {
                    name: 'Christmas Island',
                    code: 'CX'
                },
                {
                    name: 'Cocos (Keeling) Islands',
                    code: 'CC'
                },
                {
                    name: 'Colombia',
                    code: 'CO'
                },
                {
                    name: 'Comoros',
                    code: 'KM'
                },
                {
                    name: 'Congo',
                    code: 'CG'
                },
                {
                    name: 'Congo, The Democratic Republic of the',
                    code: 'CD'
                },
                {
                    name: 'Cook Islands',
                    code: 'CK'
                },
                {
                    name: 'Costa Rica',
                    code: 'CR'
                },
                {
                    name: 'Cote D\'Ivoire',
                    code: 'CI'
                },
                {
                    name: 'Croatia',
                    code: 'HR'
                },
                {
                    name: 'Cuba',
                    code: 'CU'
                },
                {
                    name: 'Cyprus',
                    code: 'CY'
                },
                {
                    name: 'Czech Republic',
                    code: 'CZ'
                },
                {
                    name: 'Denmark',
                    code: 'DK'
                },
                {
                    name: 'Djibouti',
                    code: 'DJ'
                },
                {
                    name: 'Dominica',
                    code: 'DM'
                },
                {
                    name: 'Dominican Republic',
                    code: 'DO'
                },
                {
                    name: 'Ecuador',
                    code: 'EC'
                },
                {
                    name: 'Egypt',
                    code: 'EG'
                },
                {
                    name: 'El Salvador',
                    code: 'SV'
                },
                {
                    name: 'Equatorial Guinea',
                    code: 'GQ'
                },
                {
                    name: 'Eritrea',
                    code: 'ER'
                },
                {
                    name: 'Estonia',
                    code: 'EE'
                },
                {
                    name: 'Ethiopia',
                    code: 'ET'
                },
                {
                    name: 'Falkland Islands (Malvinas)',
                    code: 'FK'
                },
                {
                    name: 'Faroe Islands',
                    code: 'FO'
                },
                {
                    name: 'Fiji',
                    code: 'FJ'
                },
                {
                    name: 'Finland',
                    code: 'FI'
                },
                {
                    name: 'France',
                    code: 'FR'
                },
                {
                    name: 'French Guiana',
                    code: 'GF'
                },
                {
                    name: 'French Polynesia',
                    code: 'PF'
                },
                {
                    name: 'French Southern Territories',
                    code: 'TF'
                },
                {
                    name: 'Gabon',
                    code: 'GA'
                },
                {
                    name: 'Gambia',
                    code: 'GM'
                },
                {
                    name: 'Georgia',
                    code: 'GE'
                },
                {
                    name: 'Germany',
                    code: 'DE'
                },
                {
                    name: 'Ghana',
                    code: 'GH'
                },
                {
                    name: 'Gibraltar',
                    code: 'GI'
                },
                {
                    name: 'Greece',
                    code: 'GR'
                },
                {
                    name: 'Greenland',
                    code: 'GL'
                },
                {
                    name: 'Grenada',
                    code: 'GD'
                },
                {
                    name: 'Guadeloupe',
                    code: 'GP'
                },
                {
                    name: 'Guam',
                    code: 'GU'
                },
                {
                    name: 'Guatemala',
                    code: 'GT'
                },
                {
                    name: 'Guernsey',
                    code: 'GG'
                },
                {
                    name: 'Guinea',
                    code: 'GN'
                },
                {
                    name: 'Guinea-Bissau',
                    code: 'GW'
                },
                {
                    name: 'Guyana',
                    code: 'GY'
                },
                {
                    name: 'Haiti',
                    code: 'HT'
                },
                {
                    name: 'Heard Island and Mcdonald Islands',
                    code: 'HM'
                },
                {
                    name: 'Holy See (Vatican City State)',
                    code: 'VA'
                },
                {
                    name: 'Honduras',
                    code: 'HN'
                },
                {
                    name: 'Hong Kong',
                    code: 'HK'
                },
                {
                    name: 'Hungary',
                    code: 'HU'
                },
                {
                    name: 'Iceland',
                    code: 'IS'
                },
                {
                    name: 'India',
                    code: 'IN'
                },
                {
                    name: 'Indonesia',
                    code: 'ID'
                },
                {
                    name: 'Iran, Islamic Republic Of',
                    code: 'IR'
                },
                {
                    name: 'Iraq',
                    code: 'IQ'
                },
                {
                    name: 'Ireland',
                    code: 'IE'
                },
                {
                    name: 'Isle of Man',
                    code: 'IM'
                },
                {
                    name: 'Israel',
                    code: 'IL'
                },
                {
                    name: 'Italy',
                    code: 'IT'
                },
                {
                    name: 'Jamaica',
                    code: 'JM'
                },
                {
                    name: 'Japan',
                    code: 'JP'
                },
                {
                    name: 'Jersey',
                    code: 'JE'
                },
                {
                    name: 'Jordan',
                    code: 'JO'
                },
                {
                    name: 'Kazakhstan',
                    code: 'KZ'
                },
                {
                    name: 'Kenya',
                    code: 'KE'
                },
                {
                    name: 'Kiribati',
                    code: 'KI'
                },
                {
                    name: 'Korea, Democratic People\'s Republic of',
                    code: 'KP'
                },
                {
                    name: 'Korea, Republic of',
                    code: 'KR'
                },
                {
                    name: 'Kuwait',
                    code: 'KW'
                },
                {
                    name: 'Kyrgyzstan',
                    code: 'KG'
                },
                {
                    name: 'Lao People\'s Democratic Republic',
                    code: 'LA'
                },
                {
                    name: 'Latvia',
                    code: 'LV'
                },
                {
                    name: 'Lebanon',
                    code: 'LB'
                },
                {
                    name: 'Lesotho',
                    code: 'LS'
                },
                {
                    name: 'Liberia',
                    code: 'LR'
                },
                {
                    name: 'Libyan Arab Jamahiriya',
                    code: 'LY'
                },
                {
                    name: 'Liechtenstein',
                    code: 'LI'
                },
                {
                    name: 'Lithuania',
                    code: 'LT'
                },
                {
                    name: 'Luxembourg',
                    code: 'LU'
                },
                {
                    name: 'Macao',
                    code: 'MO'
                },
                {
                    name: 'Macedonia, The Former Yugoslav Republic of',
                    code: 'MK'
                },
                {
                    name: 'Madagascar',
                    code: 'MG'
                },
                {
                    name: 'Malawi',
                    code: 'MW'
                },
                {
                    name: 'Malaysia',
                    code: 'MY'
                },
                {
                    name: 'Maldives',
                    code: 'MV'
                },
                {
                    name: 'Mali',
                    code: 'ML'
                },
                {
                    name: 'Malta',
                    code: 'MT'
                },
                {
                    name: 'Marshall Islands',
                    code: 'MH'
                },
                {
                    name: 'Martinique',
                    code: 'MQ'
                },
                {
                    name: 'Mauritania',
                    code: 'MR'
                },
                {
                    name: 'Mauritius',
                    code: 'MU'
                },
                {
                    name: 'Mayotte',
                    code: 'YT'
                },
                {
                    name: 'Mexico',
                    code: 'MX'
                },
                {
                    name: 'Micronesia, Federated States of',
                    code: 'FM'
                },
                {
                    name: 'Moldova, Republic of',
                    code: 'MD'
                },
                {
                    name: 'Monaco',
                    code: 'MC'
                },
                {
                    name: 'Mongolia',
                    code: 'MN'
                },
                {
                    name: 'Montserrat',
                    code: 'MS'
                },
                {
                    name: 'Morocco',
                    code: 'MA'
                },
                {
                    name: 'Mozambique',
                    code: 'MZ'
                },
                {
                    name: 'Myanmar',
                    code: 'MM'
                },
                {
                    name: 'Namibia',
                    code: 'NA'
                },
                {
                    name: 'Nauru',
                    code: 'NR'
                },
                {
                    name: 'Nepal',
                    code: 'NP'
                },
                {
                    name: 'Netherlands',
                    code: 'NL'
                },
                {
                    name: 'Netherlands Antilles',
                    code: 'AN'
                },
                {
                    name: 'New Caledonia',
                    code: 'NC'
                },
                {
                    name: 'New Zealand',
                    code: 'NZ'
                },
                {
                    name: 'Nicaragua',
                    code: 'NI'
                },
                {
                    name: 'Niger',
                    code: 'NE'
                },
                {
                    name: 'Nigeria',
                    code: 'NG'
                },
                {
                    name: 'Niue',
                    code: 'NU'
                },
                {
                    name: 'Norfolk Island',
                    code: 'NF'
                },
                {
                    name: 'Northern Mariana Islands',
                    code: 'MP'
                },
                {
                    name: 'Norway',
                    code: 'NO'
                },
                {
                    name: 'Oman',
                    code: 'OM'
                },
                {
                    name: 'Pakistan',
                    code: 'PK'
                },
                {
                    name: 'Palau',
                    code: 'PW'
                },
                {
                    name: 'Palestinian Territory, Occupied',
                    code: 'PS'
                },
                {
                    name: 'Panama',
                    code: 'PA'
                },
                {
                    name: 'Papua New Guinea',
                    code: 'PG'
                },
                {
                    name: 'Paraguay',
                    code: 'PY'
                },
                {
                    name: 'Peru',
                    code: 'PE'
                },
                {
                    name: 'Philippines',
                    code: 'PH'
                },
                {
                    name: 'Pitcairn',
                    code: 'PN'
                },
                {
                    name: 'Poland',
                    code: 'PL'
                },
                {
                    name: 'Portugal',
                    code: 'PT'
                },
                {
                    name: 'Puerto Rico',
                    code: 'PR'
                },
                {
                    name: 'Qatar',
                    code: 'QA'
                },
                {
                    name: 'Reunion',
                    code: 'RE'
                },
                {
                    name: 'Romania',
                    code: 'RO'
                },
                {
                    name: 'Russian Federation',
                    code: 'RU'
                },
                {
                    name: 'Rwanda',
                    code: 'RW'
                },
                {
                    name: 'Saint Helena',
                    code: 'SH'
                },
                {
                    name: 'Saint Kitts and Nevis',
                    code: 'KN'
                },
                {
                    name: 'Saint Lucia',
                    code: 'LC'
                },
                {
                    name: 'Saint Pierre and Miquelon',
                    code: 'PM'
                },
                {
                    name: 'Saint Vincent and the Grenadines',
                    code: 'VC'
                },
                {
                    name: 'Samoa',
                    code: 'WS'
                },
                {
                    name: 'San Marino',
                    code: 'SM'
                },
                {
                    name: 'Sao Tome and Principe',
                    code: 'ST'
                },
                {
                    name: 'Saudi Arabia',
                    code: 'SA'
                },
                {
                    name: 'Senegal',
                    code: 'SN'
                },
                {
                    name: 'Serbia and Montenegro',
                    code: 'CS'
                },
                {
                    name: 'Seychelles',
                    code: 'SC'
                },
                {
                    name: 'Sierra Leone',
                    code: 'SL'
                },
                {
                    name: 'Singapore',
                    code: 'SG'
                },
                {
                    name: 'Slovakia',
                    code: 'SK'
                },
                {
                    name: 'Slovenia',
                    code: 'SI'
                },
                {
                    name: 'Solomon Islands',
                    code: 'SB'
                },
                {
                    name: 'Somalia',
                    code: 'SO'
                },
                {
                    name: 'South Africa',
                    code: 'ZA'
                },
                {
                    name: 'South Georgia and the South Sandwich Islands',
                    code: 'GS'
                },
                {
                    name: 'Spain',
                    code: 'ES'
                },
                {
                    name: 'Sri Lanka',
                    code: 'LK'
                },
                {
                    name: 'Sudan',
                    code: 'SD'
                },
                {
                    name: 'Suriname',
                    code: 'SR'
                },
                {
                    name: 'Svalbard and Jan Mayen',
                    code: 'SJ'
                },
                {
                    name: 'Swaziland',
                    code: 'SZ'
                },
                {
                    name: 'Sweden',
                    code: 'SE'
                },
                {
                    name: 'Switzerland',
                    code: 'CH'
                },
                {
                    name: 'Syrian Arab Republic',
                    code: 'SY'
                },
                {
                    name: 'Taiwan, Province of China',
                    code: 'TW'
                },
                {
                    name: 'Tajikistan',
                    code: 'TJ'
                },
                {
                    name: 'Tanzania, United Republic of',
                    code: 'TZ'
                },
                {
                    name: 'Thailand',
                    code: 'TH'
                },
                {
                    name: 'Timor-Leste',
                    code: 'TL'
                },
                {
                    name: 'Togo',
                    code: 'TG'
                },
                {
                    name: 'Tokelau',
                    code: 'TK'
                },
                {
                    name: 'Tonga',
                    code: 'TO'
                },
                {
                    name: 'Trinidad and Tobago',
                    code: 'TT'
                },
                {
                    name: 'Tunisia',
                    code: 'TN'
                },
                {
                    name: 'Turkey',
                    code: 'TR'
                },
                {
                    name: 'Turkmenistan',
                    code: 'TM'
                },
                {
                    name: 'Turks and Caicos Islands',
                    code: 'TC'
                },
                {
                    name: 'Tuvalu',
                    code: 'TV'
                },
                {
                    name: 'Uganda',
                    code: 'UG'
                },
                {
                    name: 'Ukraine',
                    code: 'UA'
                },
                {
                    name: 'United Arab Emirates',
                    code: 'AE'
                },
                {
                    name: 'United Kingdom',
                    code: 'GB'
                },
                {
                    name: 'United States',
                    code: 'US'
                },
                {
                    name: 'United States Minor Outlying Islands',
                    code: 'UM'
                },
                {
                    name: 'Uruguay',
                    code: 'UY'
                },
                {
                    name: 'Uzbekistan',
                    code: 'UZ'
                },
                {
                    name: 'Vanuatu',
                    code: 'VU'
                },
                {
                    name: 'Venezuela',
                    code: 'VE'
                },
                {
                    name: 'Vietnam',
                    code: 'VN'
                },
                {
                    name: 'Virgin Islands, British',
                    code: 'VG'
                },
                {
                    name: 'Virgin Islands, U.S.',
                    code: 'VI'
                },
                {
                    name: 'Wallis and Futuna',
                    code: 'WF'
                },
                {
                    name: 'Western Sahara',
                    code: 'EH'
                },
                {
                    name: 'Yemen',
                    code: 'YE'
                },
                {
                    name: 'Zambia',
                    code: 'ZM'
                },
                {
                    name: 'Zimbabwe',
                    code: 'ZW'
                }
                ];
            /*EO UI-SELECT*/

            /*MATERIAL ICONS*/
            $scope.clickIcon = 'list';
            $scope.clickIconMorph = function () {
                if ($scope.clickIcon == 'list')
                    $scope.clickIcon = 'apps';
                else
                    $scope.clickIcon = 'list';
            }
            $scope.hoverIcon = 'add';
            $scope.hoverIconMorph = function () {
                $scope.hoverIcon = 'remove';
            }
            $scope.blurIconMorph = function () {
                    $scope.hoverIcon = 'add';
                }
                /*EO MATERIAL ICONS*/
            }
        ])
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    });
