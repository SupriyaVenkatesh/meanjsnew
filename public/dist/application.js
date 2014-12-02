"use strict";
var ApplicationConfiguration = function() {
    var applicationModuleName = "inoviceit",
        applicationModuleVendorDependencies = ["ngResource", "ngCookies", "ngAnimate", "ngTouch", "ngSanitize", "ui.router", "ui.bootstrap", "ui.utils", "ngGrid"],
        registerModule = function(moduleName, dependencies) {
            angular.module(moduleName, dependencies || []), angular.module(applicationModuleName).requires.push(moduleName)
        };
    return {
        applicationModuleName: applicationModuleName,
        applicationModuleVendorDependencies: applicationModuleVendorDependencies,
        registerModule: registerModule
    }
}();
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies), angular.module(ApplicationConfiguration.applicationModuleName).config(["$locationProvider", function($locationProvider) {
    $locationProvider.hashPrefix("!")
}]), angular.element(document).ready(function() {
    "#_=_" === window.location.hash && (window.location.hash = "#!"), angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName])
}), ApplicationConfiguration.registerModule("accounts"), ApplicationConfiguration.registerModule("airtel"), ApplicationConfiguration.registerModule("contacts"), ApplicationConfiguration.registerModule("core"), ApplicationConfiguration.registerModule("licenses"), ApplicationConfiguration.registerModule("organizations"), ApplicationConfiguration.registerModule("roles"), ApplicationConfiguration.registerModule("users"), angular.module("accounts").run(["Menus", function(Menus) {
    Menus.addMenuItem("topbar", "Accounts", "accounts", "dropdown", "/accounts(/create)?"), Menus.addSubMenuItem("topbar", "accounts", "List Accounts", "accounts"), Menus.addSubMenuItem("topbar", "accounts", "New Account", "accounts/create")
}]), angular.module("accounts").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listAccounts", {
        url: "/accounts",
        templateUrl: "modules/accounts/views/list-accounts.client.view.html"
    }).state("createAccount", {
        url: "/accounts/create",
        templateUrl: "modules/accounts/views/create-account.client.view.html"
    }).state("viewAccount", {
        url: "/accounts/:accountId",
        templateUrl: "modules/accounts/views/view-account.client.view.html"
    }).state("editAccount", {
        url: "/accounts/:accountId/edit",
        templateUrl: "modules/accounts/views/edit-account.client.view.html"
    })
}]), angular.module("accounts").controller("AccountsController", ["$scope", "$stateParams", "$location", "Authentication", "Accounts", "$http", function($scope, $stateParams, $location, Authentication, Accounts, $http) {
    $scope.authentication = Authentication, $scope.myData = [], $scope.myData = Accounts.query(), $scope.mySelections = [], $scope.filterOptions = {
        filterText: "",
        useExternalFilter: !0
    }, $scope.totalServerItems = 0, $scope.pagingOptions = {
        pageSizes: [250, 500, 1e3],
        pageSize: 250,
        currentPage: 1
    }, $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData, $scope.totalServerItems = data.length, $scope.$$phase || $scope.$apply()
    }, $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get("jsonFiles/largeLoad.json").success(function(largeLoad) {
                    data = largeLoad.filter(function(item) {
                        return -1 != JSON.stringify(item).toLowerCase().indexOf(ft)
                    }), $scope.setPagingData(data, page, pageSize)
                })
            } else $http.get("jsonFiles/largeLoad.json").success(function(largeLoad) {
                $scope.setPagingData(largeLoad, page, pageSize)
            })
        }, 100)
    }, $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage), $scope.$watch("pagingOptions", function(newVal, oldVal) {
        newVal !== oldVal && newVal.currentPage !== oldVal.currentPage && $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText)
    }, !0), $scope.$watch("filterOptions", function(newVal, oldVal) {
        newVal !== oldVal && $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText)
    }, !0), $scope.gridOptions = {
        data: "myData",
        enablePaging: !0,
        showFooter: !0,
        totalServerItems: "totalServerItems",
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        selectedItems: $scope.mySelections,
        multiSelect: !1,
        columnDefs: [{
            field: "firstName__C",
            displayName: "First Name"
        }, {
            field: "lastName__C",
            displayName: "Last Name"
        }, {
            field: "company__C",
            displayName: "Company"
        }, {
            field: "phone__C",
            displayName: "Phone"
        }, {
            field: "address__C",
            displayName: "Address"
        }, {
            field: "date__C",
            displayName: "Date"
        }, {
            field: "country__c",
            displayName: "Country"
        }]
    }, $scope.create = function() {
        if (angular.isUndefined(this.id__C)) {
            var account = new Accounts({
                firstName__C: this.firstName__C,
                lastName__C: this.lastName__C,
                company__C: this.company__C,
                phone__C: this.phone__C,
                address__C: this.address__C,
                date__C: this.date__C,
                country__c: this.country__c
            });
            account.$save(function() {
                $scope.firstName__C = "", $scope.lastName__C = "", $scope.company__C = "", $scope.phone__C = "", $scope.address__C = "", $scope.date__C = "", $scope.country__c = "", $scope.myData = Accounts.query()
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message
            })
        } else {
            var account = new Accounts({
                firstName__C: this.firstName__C,
                lastName__C: this.lastName__C,
                company__C: this.company__C,
                phone__C: this.phone__C,
                address__C: this.address__C,
                date__C: this.date__C,
                country__c: this.country__c,
                _id: this.id__C
            });
            $scope.update(account)
        }
    }, $scope.remove = function(account) {
        if (account) {
            account.$remove();
            for (var i in $scope.accounts) $scope.accounts[i] === account && $scope.accounts.splice(i, 1)
        } else $scope.account.$remove(function() {
            $scope.myData = Accounts.query()
        })
    }, $scope.update = function(account) {
        console.log(account), account.$update(function() {
            $scope.firstName__C = "", $scope.lastName__C = "", $scope.company__C = "", $scope.phone__C = "", $scope.address__C = "", $scope.date__C = "", $scope.country__c = "", $scope.id__C = "", $scope.myData = Accounts.query()
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.find = function() {
        $scope.accounts = Accounts.query()
    }, $scope.findOne = function() {
        $scope.account = Accounts.get({
            accountId: $stateParams.accountId
        })
    }, $scope.findOnebyId = function() {
        $scope.account = Accounts.get({
            accountId: $scope.mySelections[0]._id
        })
    }, $scope.findOnebyIdtoEdit = function() {
        $scope.firstName__C = $scope.mySelections[0].firstName__C, $scope.id__C = $scope.mySelections[0]._id, $scope.lastName__C = $scope.mySelections[0].lastName__C, $scope.company__C = $scope.mySelections[0].company__C, $scope.phone__C = $scope.mySelections[0].phone__C, $scope.address__C = $scope.mySelections[0].address__C, $scope.date__C = $scope.mySelections[0].date__C, $scope.country__c = $scope.mySelections[0].country__c
    }
}]), angular.module("accounts").factory("Accounts", ["$resource", function($resource) {
    return $resource("accounts/:accountId", {
        accountId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), angular.module("contacts").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listContacts", {
        url: "/contacts",
        templateUrl: "modules/contacts/views/list-contacts.client.view.html"
    }).state("createContact", {
        url: "/contacts/create",
        templateUrl: "modules/contacts/views/create-contact.client.view.html"
    }).state("viewContact", {
        url: "/contacts/:contactId",
        templateUrl: "modules/contacts/views/view-contact.client.view.html"
    }).state("editContact", {
        url: "/contacts/:contactId/edit",
        templateUrl: "modules/contacts/views/edit-contact.client.view.html"
    })
}]), angular.module("contacts").controller("ContactsController", ["$scope", "$stateParams", "$location", "Authentication", "Contacts", function($scope, $stateParams, $location, Authentication, Contacts) {
    $scope.authentication = Authentication, $scope.myData = [], $scope.myData = Contacts.query(), $scope.mySelections = [], $scope.filterOptions = {
        filterText: "",
        useExternalFilter: !0
    }, $scope.totalServerItems = 0, $scope.pagingOptions = {
        pageSizes: [250, 500, 1e3],
        pageSize: 250,
        currentPage: 1
    }, $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData, $scope.totalServerItems = data.length, $scope.$$phase || $scope.$apply()
    }, $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get("jsonFiles/largeLoad.json").success(function(largeLoad) {
                    data = largeLoad.filter(function(item) {
                        return -1 != JSON.stringify(item).toLowerCase().indexOf(ft)
                    }), $scope.setPagingData(data, page, pageSize)
                })
            } else $http.get("jsonFiles/largeLoad.json").success(function(largeLoad) {
                $scope.setPagingData(largeLoad, page, pageSize)
            })
        }, 100)
    }, $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage), $scope.$watch("pagingOptions", function(newVal, oldVal) {
        newVal !== oldVal && newVal.currentPage !== oldVal.currentPage && $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText)
    }, !0), $scope.$watch("filterOptions", function(newVal, oldVal) {
        newVal !== oldVal && $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText)
    }, !0), $scope.gridOptions = {
        data: "myData",
        enablePaging: !0,
        showFooter: !0,
        totalServerItems: "totalServerItems",
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        selectedItems: $scope.mySelections,
        multiSelect: !1,
        columnDefs: [{
            field: "firstName__C",
            displayName: "First Name"
        }, {
            field: "lastName__C",
            displayName: "Last Name"
        }, {
            field: "company__C",
            displayName: "Company"
        }, {
            field: "phone__C",
            displayName: "Phone"
        }, {
            field: "address__C",
            displayName: "Address"
        }, {
            field: "date__C",
            displayName: "Date"
        }, {
            field: "country__c",
            displayName: "Country"
        }]
    }, $scope.create = function() {
        if (angular.isUndefined(this.id__C)) {
            var contact = new Contacts({
                firstName__C: this.firstName__C,
                lastName__C: this.lastName__C,
                company__C: this.company__C,
                phone__C: this.phone__C,
                address__C: this.address__C,
                date__C: this.date__C,
                country__c: this.country__c
            });
            contact.$save(function() {
                $scope.firstName__C = "", $scope.lastName__C = "", $scope.company__C = "", $scope.phone__C = "", $scope.address__C = "", $scope.date__C = "", $scope.country__c = "", $scope.myData = Contacts.query()
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message
            })
        } else {
            var contact = new Contacts({
                firstName__C: this.firstName__C,
                lastName__C: this.lastName__C,
                company__C: this.company__C,
                phone__C: this.phone__C,
                address__C: this.address__C,
                date__C: this.date__C,
                country__c: this.country__c,
                _id: this.id__C
            });
            $scope.update(contact)
        }
    }, $scope.remove = function(contact) {
        if (contact) {
            contact.$remove();
            for (var i in $scope.contacts) $scope.contacts[i] === contact && $scope.contacts.splice(i, 1)
        } else $scope.contact.$remove(function() {
            $scope.myData = Contacts.query()
        })
    }, $scope.update = function() {
        var contact = $scope.contact;
        contact.$update(function() {
            $scope.firstName__C = "", $scope.lastName__C = "", $scope.company__C = "", $scope.phone__C = "", $scope.address__C = "", $scope.date__C = "", $scope.country__c = "", $scope.id__C = "", $scope.myData = Contacts.query()
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.find = function() {
        $scope.contacts = Contacts.query()
    }, $scope.findOne = function() {
        $scope.contact = Contacts.get({
            contactId: $stateParams.contactId
        })
    }, $scope.findOnebyId = function() {
        $scope.contact = Contacts.get({
            contactId: $scope.mySelections[0]._id
        })
    }, $scope.findOnebyIdtoEdit = function() {
        $scope.firstName__C = $scope.mySelections[0].firstName__C, $scope.id__C = $scope.mySelections[0]._id, $scope.lastName__C = $scope.mySelections[0].lastName__C, $scope.company__C = $scope.mySelections[0].company__C, $scope.phone__C = $scope.mySelections[0].phone__C, $scope.address__C = $scope.mySelections[0].address__C, $scope.date__C = $scope.mySelections[0].date__C, $scope.country__c = $scope.mySelections[0].country__c
    }
}]), angular.module("contacts").factory("Contacts", ["$resource", function($resource) {
    return $resource("contacts/:contactId", {
        contactId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), angular.module("core").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/"), $stateProvider.state("home", {
        url: "/",
        templateUrl: "modules/users/views/authentication/signin.client.view.html"
    }).state("userhome", {
        url: "/userhome",
        templateUrl: "modules/core/views/userindexpage.html"
    }).state("accountDetailPage", {
        url: "/accountDetailPage",
        templateUrl: "modules/accounts/views/account-home.html"
    }).state("contactDetailPage", {
        url: "/contactDetailPage",
        templateUrl: "modules/contacts/views/contact-home.html"
    }).state("adminsingupPage", {
        url: "/adminsingupPage",
        templateUrl: "modules/organizations/views/admin-login.html"
    }).state("superadminindexpage", {
        url: "/superadminindexpage",
        templateUrl: "modules/core/views/superadminindexpage.html"
    }).state("adminindexpage", {
        url: "/adminindexpage",
        templateUrl: "modules/core/views/adminindexpage.html"
    }).state("adminCreateUser", {
        url: "/adminCreateUser",
        templateUrl: "modules/core/views/adminCreateUser.html"
    }).state("uploadImageAdmin", {
        url: "/uploadImageAdmin",
        templateUrl: "modules/core/views/uploadImageAdmin.html"
    }).state("uploadimage", {
        url: "/uploadimage",
        templateUrl: "modules/core/views/uploadimage.html"
    }).state("createRoles", {
        url: "/createRoles",
        templateUrl: "modules/core/views/createRoles.html"
    }).state("OrganizationCreatePage", {
        url: "/OrganizationCreatePage",
        templateUrl: "modules/organizations/views/create-organization.client.view.html"
    }).state("viewadmins", {
        url: "/viewadmins",
        templateUrl: "modules/core/views/viewadmins.html"
    }).state("createuserpage", {
        url: "/createuserpage",
        templateUrl: "modules/users/views/authentication/signup.client.view.html"
    }).state("viewusers", {
        url: "/viewusers",
        templateUrl: "modules/core/views/viewusers.html"
    })
}]);
var app = angular.module("core");
app.controller("HeaderController", ["$scope", "Authentication", "Menus", "sharedProperties", "Organizations", function($scope, Authentication, Menus, sharedProperties, Organizations) {
    $scope.authentication = Authentication, $scope.isCollapsed = !1, $scope.AllCompanies = Organizations.query(), $scope.organization = Organizations.get({
        organizationId: $scope.authentication.user.orgId
    }), $scope.orgname = $scope.organization.name + "_logo.png", $scope.LogoName = "InvoiceIT.com_logo.png", $scope.LogoName2 = "InvoiceIT.com", $scope.menu = Menus.getMenu("topbar"), $scope.toggleCollapsibleMenu = function() {
        $scope.isCollapsed = !$scope.isCollapsed
    }, $scope.$on("$stateChangeSuccess", function() {
        $scope.isCollapsed = !1
    })
}]), angular.module("core").controller("HomeController", ["$scope", "Authentication", function($scope, Authentication) {
    $scope.authentication = Authentication
}]), angular.module("core").service("Menus", [function() {
    this.defaultRoles = ["*"], this.menus = {};
    var shouldRender = function(user) {
        if (!user) return this.isPublic;
        if (~this.roles.indexOf("*")) return !0;
        for (var userRoleIndex in user.roles)
            for (var roleIndex in this.roles)
                if (this.roles[roleIndex] === user.roles[userRoleIndex]) return !0;
        return !1
    };
    this.validateMenuExistance = function(menuId) {
        if (menuId && menuId.length) {
            if (this.menus[menuId]) return !0;
            throw new Error("Menu does not exists")
        }
        throw new Error("MenuId was not provided")
    }, this.getMenu = function(menuId) {
        return this.validateMenuExistance(menuId), this.menus[menuId]
    }, this.addMenu = function(menuId, isPublic, roles) {
        return this.menus[menuId] = {
            isPublic: isPublic || !1,
            roles: roles || this.defaultRoles,
            items: [],
            shouldRender: shouldRender
        }, this.menus[menuId]
    }, this.removeMenu = function(menuId) {
        this.validateMenuExistance(menuId), delete this.menus[menuId]
    }, this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
        return this.validateMenuExistance(menuId), this.menus[menuId].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            menuItemType: menuItemType || "item",
            menuItemClass: menuItemType,
            uiRoute: menuItemUIRoute || "/" + menuItemURL,
            isPublic: null === isPublic || "undefined" == typeof isPublic ? this.menus[menuId].isPublic : isPublic,
            roles: null === roles || "undefined" == typeof roles ? this.menus[menuId].roles : roles,
            position: position || 0,
            items: [],
            shouldRender: shouldRender
        }), this.menus[menuId]
    }, this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items) this.menus[menuId].items[itemIndex].link === rootMenuItemURL && this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || "/" + menuItemURL,
            isPublic: null === isPublic || "undefined" == typeof isPublic ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: null === roles || "undefined" == typeof roles ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
        });
        return this.menus[menuId]
    }, this.removeMenuItem = function(menuId, menuItemURL) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items) this.menus[menuId].items[itemIndex].link === menuItemURL && this.menus[menuId].items.splice(itemIndex, 1);
        return this.menus[menuId]
    }, this.removeSubMenuItem = function(menuId, submenuItemURL) {
        this.validateMenuExistance(menuId);
        for (var itemIndex in this.menus[menuId].items)
            for (var subitemIndex in this.menus[menuId].items[itemIndex].items) this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL && this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
        return this.menus[menuId]
    }, this.addMenu("topbar")
}]), angular.module("licenses").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listLicenses", {
        url: "/licenses",
        templateUrl: "modules/licenses/views/list-licenses.client.view.html"
    }).state("createLicense", {
        url: "/licenses/create",
        templateUrl: "modules/licenses/views/create-license.client.view.html"
    }).state("viewLicense", {
        url: "/licenses/:licenseId",
        templateUrl: "modules/licenses/views/view-license.client.view.html"
    }).state("editLicense", {
        url: "/licenses/:licenseId/edit",
        templateUrl: "modules/licenses/views/edit-license.client.view.html"
    })
}]), angular.module("licenses", []).service("licenseProperties", ["Licenses", "$q", function(Licenses, $q) {
    return {
        create: function(value, callback) {
            var deferred = $q.defer(),
                license = new Licenses({
                    name: value
                });
            license.$save(function(response) {
                deferred.resolve(response)
            }, function() {
                deferred.reject()
            });
            var myData = deferred.promise;
            myData.then(function(data) {
                callback(data)
            })
        }
    }
}]), angular.module("licenses").controller("LicensesController", ["$scope", "$stateParams", "$location", "Authentication", "Licenses", function($scope, $stateParams, $location, Authentication, Licenses) {
    $scope.authentication = Authentication, $scope.create = function() {
        var license = new Licenses({
            name: this.name
        });
        license.$save(function(response) {
            $location.path("licenses/" + response._id), $scope.name = ""
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.remove = function(license) {
        if (license) {
            license.$remove();
            for (var i in $scope.licenses) $scope.licenses[i] === license && $scope.licenses.splice(i, 1)
        } else $scope.license.$remove(function() {
            $location.path("licenses")
        })
    }, $scope.update = function() {
        var license = $scope.license;
        license.$update(function() {
            $location.path("licenses/" + license._id)
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.find = function() {
        $scope.licenses = Licenses.query()
    }, $scope.findOne = function() {
        $scope.license = Licenses.get({
            licenseId: $stateParams.licenseId
        })
    }
}]), angular.module("licenses").factory("Licenses", ["$resource", function($resource) {
    return $resource("licenses/:licenseId", {
        licenseId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), angular.module("organizations").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listOrganizations", {
        url: "/organizations",
        templateUrl: "modules/organizations/views/list-organizations.client.view.html"
    }).state("createOrganization", {
        url: "/organizations/create",
        templateUrl: "modules/organizations/views/create-organization.client.view.html"
    }).state("viewOrganization", {
        url: "/organizations/:organizationId",
        templateUrl: "modules/organizations/views/view-organization.client.view.html"
    }).state("editOrganization", {
        url: "/organizations/:organizationId/edit",
        templateUrl: "modules/organizations/views/edit-organization.client.view.html"
    })
}]);
var app = angular.module("organizations", ["angularFileUpload"]);
app.service("sharedProperties", ["Organizations", "$q", function(Organizations, $q) {
    var OrganizationsList = Organizations.query();
    return {
        create: function(value, callback) {
            var deferred = $q.defer(),
                organization = new Organizations({
                    name: value
                });
            organization.$save(function(response) {
                deferred.resolve(response)
            }, function() {
                deferred.reject()
            });
            var myData = deferred.promise;
            myData.then(function(data) {
                callback(data)
            })
        },
        orgLength: function() {
            return OrganizationsList
        }
    }
}]), app.directive("file", function() {
    return {
        $scope: {
            file: "="
        },
        link: function($scope, el) {
            el.bind("change", function(event) {
                event.target.files[0], $scope.file = (event.srcElement || event.target).files[0], $scope.$apply(), $scope.getFile()
            })
        }
    }
}), app.factory("fileReader", ["$q", "$log", function($q) {
    var onLoad = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.resolve(reader.result)
                })
            }
        },
        onError = function(reader, deferred, scope) {
            return function() {
                scope.$apply(function() {
                    deferred.reject(reader.result)
                })
            }
        },
        onProgress = function(reader, scope) {
            return function(event) {
                scope.$broadcast("fileProgress", {
                    total: event.total,
                    loaded: event.loaded
                })
            }
        },
        getReader = function(deferred, scope) {
            var reader = new FileReader;
            return reader.onload = onLoad(reader, deferred, scope), reader.onerror = onError(reader, deferred, scope), reader.onprogress = onProgress(reader, scope), reader
        },
        readAsDataURL = function(file, scope) {
            var deferred = $q.defer(),
                reader = getReader(deferred, scope);
            return reader.readAsDataURL(file), deferred.promise
        };
    return {
        readAsDataUrl: readAsDataURL
    }
}]), app.controller("OrganizationsController", ["$scope", "$stateParams", "$location", "Authentication", "Organizations", "$http", "$upload", "fileReader", function($scope, $stateParams, $location, Authentication, Organizations, $http, $upload, fileReader) {
    $scope.authentication = Authentication, $scope.AllCompanyNames = Organizations.query(), $scope.create = function() {
        var organization = new Organizations({
            name: this.name,
            email: this.email,
            licenses: this.licenses
        });
        return organization.$save(function() {
            $scope.name = "", $scope.email = "", $scope.licenses = ""
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        }), response._id
    }, $scope.remove = function(organization) {
        if (organization) {
            organization.$remove();
            for (var i in $scope.organizations) $scope.organizations[i] === organization && $scope.organizations.splice(i, 1)
        } else $scope.organization.$remove(function() {
            $location.path("organizations")
        })
    }, $scope.update = function() {
        var organization = $scope.organization;
        organization.$update(function() {
            $location.path("organizations/" + organization._id)
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.find = function() {
        $scope.organizations = Organizations.query()
    }, $scope.findcomp = function() {
        $scope.allorganizations = Organizations.query(), console.log("$scope.allorganizations=" + $scope.allorganizations), $scope.gridOptions = {
            data: "allorganizations",
            enablePaging: !0,
            showFooter: !0,
            multiSelect: !1,
            columnDefs: [{
                field: "name",
                displayName: "Company name"
            }, {
                field: "email",
                displayName: "Email"
            }, {
                field: "licenses",
                displayName: "Licenses"
            }]
        }
    }, $scope.findOne = function() {
        $scope.organization = Organizations.get({
            organizationId: $stateParams.organizationId
        })
    }, $scope.orgImage = Organizations.get({
        organizationId: $scope.authentication.user.orgId
    }), $scope.getFile = function() {
        console.log("came inside getfile"), fileReader.readAsDataUrl($scope.file, $scope).then(function(result) {
            $scope.imageSrc = result
        })
    }, $scope.onDropSelect = function($files) {
        $scope.selectedFiles = [];
        for (var i = 0; i < $files.length; i++) $scope.selectedFiles = $files[i];
        fileReader.readAsDataUrl($scope.selectedFiles, $scope).then(function(result) {
            $scope.imageSrc = result
        })
    }, $scope.updateSth = function() {
        console.log("$scope.cname2 11" + $scope.cname2), $scope.cname2 = "undefined" == typeof $scope.Orglist ? $scope.orgImage.name : $scope.Orglist.name, console.log("$scope.cname2 22" + $scope.cname2), console.log(" $scope.file ---", $scope.file), $http({
            method: "POST",
            url: "/upload",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: {
                name: $scope.cname2,
                file: $scope.file,
                dropfile: $scope.selectedFiles
            },
            transformRequest: function(data, headersGetter) {
                var formData = new FormData;
                angular.forEach(data, function(value, key) {
                    formData.append(key, value), console.log("key---->" + key), console.log("value", value)
                });
                var headers = headersGetter();
                return delete headers["Content-Type"], formData
            }
        }).success(function() {
            alert("success"), window.location.href = "/#!/uploadImageAdmin", window.location.reload()
        }).error(function() {
            alert("failed")
        })
    }, $scope.files = [], $scope.setFiles = function(element) {
        $scope.$apply(function($scope) {
            console.log("fields:", element.fields);
            for (var i = 0; i < element.files.length; i++) $scope.files.push(element.files[i]);
            $scope.progressVisible = !1, console.log("$scope.cname1: " + $scope.cname), console.log("$scope.file: %j", $scope.file)
        })
    }, $scope.onFileSelect = function() {
        var fd = new FormData;
        for (var i in $scope.files) fd.append("uploadedFile", $scope.files[i]);
        var image = $scope.files;
        return console.log("image:", image), angular.isArray(image) && (image = image[0]), angular.forEach(image[0], function(value, key) {
            console.log(key + " $scope.files--> " + value)
        }), "image/png" !== image.type && "image/jpeg" !== image.type ? void alert("Only PNG and JPEG are accepted.") : ($scope.uploadInProgress = !0, $scope.uploadProgress = 0, $scope.upload = $upload.upload({
            url: "/upload",
            method: "POST",
            file: image,
            field: $scope.cname
        }).progress(function(event) {
            $scope.progressVisible = !0, $scope.uploadProgress = Math.floor(event.loaded / event.total), $scope.progress = Math.round(100 * event.loaded / event.total), $scope.$apply()
        }).success(function() {
            $scope.progressVisible = !0, $scope.uploadInProgress = !1
        }).error(function(err) {
            alert("failed"), $scope.uploadInProgress = !1, console.log("Error uploading file: " + err.message || err)
        }), void($scope.upload = ""))
    }
}]), angular.module("organizations").factory("Organizations", ["$resource", function($resource) {
    return $resource("organizations/:organizationId", {
        organizationId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), angular.module("roles").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("listRoles", {
        url: "/roles",
        templateUrl: "modules/roles/views/list-roles.client.view.html"
    }).state("createRole", {
        url: "/roles/create",
        templateUrl: "modules/roles/views/create-role.client.view.html"
    }).state("viewRole", {
        url: "/roles/:roleId",
        templateUrl: "modules/roles/views/view-role.client.view.html"
    }).state("editRole", {
        url: "/roles/:roleId/edit",
        templateUrl: "modules/roles/views/edit-role.client.view.html"
    })
}]);
var app = angular.module("roles", []);
app.service("rolesProperties", ["Roles", function(Roles) {
    var RolesList = Roles.query();
    return {
        all: function() {
            return RolesList
        },
        first: function() {
            return RolesList[0]
        }
    }
}]), app.directive("capitalize", function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, modelCtrl) {
            var capitalize = function(inputValue) {
                void 0 == inputValue && (inputValue = "");
                var capitalized = inputValue.toUpperCase();
                return capitalized !== inputValue && (modelCtrl.$setViewValue(capitalized), modelCtrl.$render()), capitalized
            };
            modelCtrl.$parsers.push(capitalize), capitalize(scope[attrs.ngModel])
        }
    }
}), app.controller("RolesCreateController", ["$scope", "$stateParams", "$location", "Roles", function($scope, $stateParams, $location, Roles) {
    $scope.create = function() {
        var role = new Roles({
            name: this.name
        });
        role.$save(function() {
            $scope.name = "", alert("Role is Created"), $location.path("/superadminindexpage")
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }
}]), app.controller("RolesController", ["$scope", "$stateParams", "$location", "Authentication", "Roles", function($scope, $stateParams, $location, Authentication, Roles) {
    $scope.create = function() {
        var role = new Roles({
            name: this.name
        });
        role.$save(function(response) {
            $location.path("roles/" + response._id), $scope.name = ""
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.remove = function(role) {
        if (role) {
            role.$remove();
            for (var i in $scope.roles) $scope.roles[i] === role && $scope.roles.splice(i, 1)
        } else $scope.role.$remove(function() {
            $location.path("roles")
        })
    }, $scope.update = function() {
        var role = $scope.role;
        role.$update(function() {
            $location.path("roles/" + role._id)
        }, function(errorResponse) {
            $scope.error = errorResponse.data.message
        })
    }, $scope.find = function() {
        $scope.roles = Roles.query()
    }, $scope.findOne = function() {
        $scope.role = Roles.get({
            roleId: $stateParams.roleId
        })
    }
}]), angular.module("roles").factory("Roles", ["$resource", function($resource) {
    return $resource("roles/:roleId", {
        roleId: "@_id"
    }, {
        update: {
            method: "PUT"
        }
    })
}]), angular.module("users").config(["$httpProvider", function($httpProvider) {
    $httpProvider.interceptors.push(["$q", "$location", "Authentication", function($q, $location, Authentication) {
        return {
            responseError: function(rejection) {
                switch (rejection.status) {
                    case 401:
                        Authentication.user = null, $location.path("signin");
                        break;
                    case 403:
                }
                return $q.reject(rejection)
            }
        }
    }])
}]), angular.module("users").config(["$stateProvider", function($stateProvider) {
    $stateProvider.state("profile", {
        url: "/settings/profile",
        templateUrl: "modules/users/views/settings/edit-profile.client.view.html"
    }).state("password", {
        url: "/settings/password",
        templateUrl: "modules/users/views/settings/change-password.client.view.html"
    }).state("accounts", {
        url: "/settings/accounts",
        templateUrl: "modules/users/views/settings/social-accounts.client.view.html"
    }).state("signup", {
        url: "/signup",
        templateUrl: "modules/users/views/authentication/signup.client.view.html"
    }).state("signin", {
        url: "/signin",
        templateUrl: "modules/users/views/authentication/signin.client.view.html"
    }).state("forgot", {
        url: "/password/forgot",
        templateUrl: "modules/users/views/password/forgot-password.client.view.html"
    }).state("reset-invlaid", {
        url: "/password/reset/invalid",
        templateUrl: "modules/users/views/password/reset-password-invalid.client.view.html"
    }).state("reset-success", {
        url: "/password/reset/success",
        templateUrl: "modules/users/views/password/reset-password-success.client.view.html"
    }).state("reset", {
        url: "/password/reset/:token",
        templateUrl: "modules/users/views/password/reset-password.client.view.html"
    })
}]), angular.module("users").controller("AuthenticationController", ["$scope", "$http", "$window", "$location", "Authentication", "sharedProperties", "Users", "$stateParams", "licenseProperties", "rolesProperties", "Organizations", function($scope, $http, $window, $location, Authentication, sharedProperties, Users, $stateParams, licenseProperties, rolesProperties, Organizations) {
    $scope.authentication = Authentication, $scope.GlobalRoles = rolesProperties.all(), $scope.GlobalCompany = sharedProperties.orgLength(), $scope.GlobalUsers = Users.query(), $scope.GlobalOrganizations = sharedProperties.orgLength(), $scope.mySelections = [], $scope.sample = [], $scope.find = function() {
        $scope.OnlyAdmnUsers = Users.get({
            userorgId: $scope.authentication.user.orgId
        }), console.log(" 	$scope.OnlyAdmnUsers-->", $scope.OnlyAdmnUsers), $scope.allnames = $scope.Globalname, $scope.allCompanies = $scope.GlobalCompany, $scope.Admincompany = Organizations.get({
            organizationId: $scope.authentication.user.orgId
        }), console.log("$scope.Admincompany---", $scope.Admincompany), $scope.allRoles = $scope.GlobalRoles, $scope.onlyUsers = [], $scope.onlyUsers = Users.query(), console.log(" $scope.onlyUsers11--", $scope.onlyUsers), angular.forEach($scope.users, function(value) {
            angular.forEach(value, function(value1, key1) {
                "orgId" == key1 && value1 == $scope.authentication.user.orgId && $scope.onlyUsers.push(value)
            })
        }), console.log(" $scope.onlyUsers22--", $scope.onlyUsers), $scope.gridOptions = {
            data: "onlyUsers",
            enablePaging: !0,
            showFooter: !0,
            selectedItems: $scope.mySelections,
            multiSelect: !1,
            columnDefs: [{
                field: "orgId",
                displayName: "Company"
            }, {
                field: "firstName",
                displayName: "First Name"
            }, {
                field: "lastName",
                displayName: "Last Name"
            }, {
                field: "email",
                displayName: "Email"
            }, {
                field: "role",
                displayName: "Role"
            }]
        }
    }, $scope.signup = function() {
        $scope.credentials.role = $scope.credentials.newrole._id, $scope.credentials.companyName = $scope.credentials.newcompany._id, null != $scope.credentials.companyName && "" != $scope.credentials.companyName ? (null != $scope.credentials.licenses && "" != $scope.credentials.licenses && (console.log(" if $scope.credentials-->" + $scope.credentials), licenseProperties.create($scope.credentials.licenses, function(result) {
            angular.forEach(result, function() {})
        })), sharedProperties.create($scope.credentials.companyName, function(result) {
            angular.forEach(result, function(value, key) {
                "_id" == key && $scope.assingValue(value)
            })
        })) : ($scope.credentials.orgId = $scope.authentication.user.orgId, $scope.length = 0, angular.forEach($scope.GlobalUsers, function(value) {
            angular.forEach(value, function(value1, key1) {
                "orgId" == key1 && value1 == $scope.authentication.user.orgId && $scope.length++
            })
        }), $scope.authentication.user.licenses > $scope.length ? $http.post("/auth/signup", $scope.credentials).success(function() {
            $location.path("/adminindexpage")
        }).error(function(response) {
            $scope.error = response.message
        }) : (alert("sorry!. Your Licenses are over"), $scope.credentials = ""))
    }, $scope.signupforUser = function() {
        $scope.credentials.role = $scope.credentials.newrole._id, $scope.credentials.orgId = $scope.Admincompany._id, $scope.credentials.displayName = $scope.credentials.firstName + $scope.credentials.lastName, $scope.credentials.username = $scope.credentials.firstName + $scope.credentials.lastName, $scope.credentials.password = $scope.credentials.firstName + $scope.credentials.lastName, $scope.sample.push({
            username: $scope.credentials.username,
            toaddress: $scope.credentials.email
        }), console.log("sample-->" + $scope.sample), $http.post("/auth/signup", $scope.credentials).success(function() {
            $scope.onlyUsers = Users.query(), $http.post("/auth/sendmailnewuser", $scope.sample).success(function() {}).error(function() {}), $scope.credentials = ""
        }).error(function(response) {
            $scope.error = response.message
        })
    }, $scope.assingValue = function(value) {
        $scope.credentials.orgId = value, $http.post("/auth/signup", $scope.credentials).success(function(response) {
            $scope.authentication.user = response, $location.path("/superadminindexpage")
        }).error(function(response) {
            $scope.error = response.message
        })
    }, $scope.findOnebyIdtoEdit = function() {
        angular.forEach($scope.mySelections[0], function() {
            $("#firstName").val($scope.mySelections[0].firstName), $("#lastName").val($scope.mySelections[0].lastName), $("#email").val($scope.mySelections[0].email)
        })
    }, $scope.signin = function() {
        $http.post("/auth/signin", $scope.credentials).success(function(response) {
            $scope.authentication.user = response, $scope.signinuser = $scope.authentication.user, $scope.userRole = $scope.authentication.user.role, angular.forEach($scope.GlobalRoles, function(value) {
                angular.forEach(value, function(value1, key1) {
                    "_id" == key1 && value1 == $scope.userRole && ("superAdmin" == value.name ? (window.location.href = "/#!/superadminindexpage", window.location.reload()) : "Admin" == value.name ? (window.location.href = "/#!/adminindexpage", window.location.reload()) : "admin" == value.name ? (window.location.href = "/#!/adminindexpage", window.location.reload()) : "ADMIN" == value.name ? (window.location.href = "/#!/adminindexpage", window.location.reload()) : "user" == value.name ? (window.location.href = "/#!/userhome", window.location.reload()) : (window.location.href = "/#!/userhome", window.location.reload()))
                })
            })
        }).error(function(response) {
            $scope.error = response.message
        })
    }
}]), angular.module("users").controller("PasswordController", ["$scope", "$stateParams", "$http", "$location", "Authentication", function($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication, $scope.authentication.user && $location.path("/"), $scope.askForPasswordReset = function() {
        $scope.success = $scope.error = null, $http.post("/auth/forgot", $scope.credentials).success(function(response) {
            $scope.credentials = null, $scope.success = response.message
        }).error(function(response) {
            $scope.credentials = null, $scope.error = response.message
        })
    }, $scope.resetUserPassword = function() {
        $scope.success = $scope.error = null, $http.post("/auth/reset/" + $stateParams.token, $scope.passwordDetails).success(function(response) {
            $scope.passwordDetails = null, Authentication.user = response, $location.path("/password/reset/success")
        }).error(function(response) {
            $scope.error = response.message
        })
    }
}]), angular.module("users").controller("SettingsController", ["$scope", "$http", "$location", "Users", "Authentication", function($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user, $scope.user || $location.path("/"), $scope.hasConnectedAdditionalSocialAccounts = function() {
        for (var i in $scope.user.additionalProvidersData) return !0;
        return !1
    }, $scope.isConnectedSocialAccount = function(provider) {
        return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]
    }, $scope.removeUserSocialAccount = function(provider) {
        $scope.success = $scope.error = null, $http.delete("/users/accounts", {
            params: {
                provider: provider
            }
        }).success(function(response) {
            $scope.success = !0, $scope.user = Authentication.user = response
        }).error(function(response) {
            $scope.error = response.message
        })
    }, $scope.updateUserProfile = function(isValid) {
        if (isValid) {
            $scope.success = $scope.error = null;
            var user = new Users($scope.user);
            user.$update(function(response) {
                $scope.success = !0, Authentication.user = response
            }, function(response) {
                $scope.error = response.data.message
            })
        } else $scope.submitted = !0
    }, $scope.changeUserPassword = function() {
        $scope.success = $scope.error = null, $http.post("/users/password", $scope.passwordDetails).success(function() {
            $scope.success = !0, $scope.passwordDetails = null
        }).error(function(response) {
            $scope.error = response.message
        })
    }
}]), angular.module("users").factory("Authentication", [function() {
    var _this = this;
    return _this._data = {
        user: window.user
    }, _this._data
}]), angular.module("users").factory("Users", ["$resource", function($resource) {
    return $resource("users", {}, {
        update: {
            method: "PUT"
        }
    })
}]);