(function ($, w) {
    'use strict';

    $(function () {

//        var valid = {
//                'e-mail': /^([а-яa-z0-9_-]+\.)*[а-яa-z0-9_-]+@[а-яa-z0-9_-]+(\.[а-яa-z0-9_-]+)*\.[а-яa-z]{2,6}$/,
//                'phone': /^\+?\d{6,}$/
//            },
//            messages = {
//                'e-mail': 'неверный формат e-mail',
//                'phone': 'неверный формат телефона',
//                'success':'Ваша заявка успешно отправлена!'
//            };
//
//        function FormInput($el) {
//            this.$el = $el;
//            this.$input = $el.find('.b-zayavka__input');
//            this.$btn = $el.find('.b-zayavka__btn a');
//            this.$result_text = $el.find('.b-zayavka__result');
//        }
//
//        FormInput.prototype.init = function () {
//            this.$btn.on('click', $.proxy(function (e) {
//                e.preventDefault();
//                var data_pre = this.$input.val();
//                if (this.validate(data_pre)) {
//                    var data = this.$el.serialize();
//                    this.sendAjax(data);
//                }
//            }, this))
//        };
//
//        FormInput.prototype.validate = function (value) {
//            var type = /@/.test(value) ? 'e-mail' : 'phone';
//            if (valid[type].test(value)) {
//                this.$result_text.html();
//                this.$el.removeClass('invalid');
//                return true;
//            } else {
//                this.$result_text.html(messages[type]);
//                this.$el.addClass('invalid');
//                return false;
//            }
//        };
//
//        FormInput.prototype.sendAjax = function(data){
//           this.$result_text.html(messages['success']);
//        };
//
//        var form = document.forms['zayavka'],
//            form_obj = new FormInput($(form));
//        form_obj.init();

//        var $btn = $('.b-zayavka__btn').find('.b-btn-green');
//        $btn.on('click',function(e){
//            e.preventDefault();
//            s(w.parent.document);
//        })

    })

})(jQuery, window);
var dev_kit = {
    'makeItemActive': function ($item) {
        $item.addClass('active').siblings().removeClass('active');
    }
};

function s(string) {
    console.log(string);
}


(function ($, w) {
    'use strict';
    $(w).load(function () {
        var $menu_windows_links = $('.b-calc__menuwindow').find('.menuwindow__item'),
            $image_blocks = $('.b-settings__block');


        /*Определение классов*/

        /*Тип окна - 1 створка, 2 створки, 3 створки, фрамуга, балконная группа*/
        function WindowButton($el) {
            this.$el = $el;
            this.window_type = this.$el.data('block');
            this.$image_block = $image_blocks.filter('#pic-' + this.window_type);
            this.$menu_stvorki = this.$image_block.find('.b-calc__menustvorka').find('.menustvorka__item');
        }

        WindowButton.prototype.init = function () {
            var self = this;
            this.stvorki_mass = [];

            $.each(this.$menu_stvorki, function (i, el) {       //Собрали все створки в массивчик
                var stvorka = new StvorkaType($(el), self);
                stvorka.init();
                self.stvorki_mass.push(stvorka);
            });

            this.$el.on('click', function () {      //Клик по типу окна
                var $this = $(this);

                $d.trigger('change_slider_val', self.window_type);

                dev_kit.makeItemActive($this);
                dev_kit.makeItemActive(self.$image_block);
                $d.trigger('send_settings');
            });
        };

        WindowButton.prototype.getSet = function () {
            var set = {};
            set.win_type = this.window_type;
            set.stvorki = this.getStvorkaSet();

            return set;
        };

        WindowButton.prototype.getStvorkaSet = function () {
            var set = {},
                length = this.stvorki_mass.length;

            for (var i = 0; i < length; i++) {
                if (this.stvorki_mass[i].$el.hasClass('item_excluded')) {   //У балконов вторая створка может отключаться
                    continue;
                }
                set[i + 1] = this.stvorki_mass[i].getPosition();
            }

            return set;
        };

        /*Тип створки*/
        function StvorkaType($el, parent) {
            this.$el = $el;
            this.$submenu_links = this.$el.find('.menustvorka__submenu').find('.submenu__item');
            this.parent = parent;

            /*Каждая менюшка-створка может включать-выключать раму*/
            var _index = this.parent.$menu_stvorki.index($el) + 1;
            this.$rama = parent.$image_block.find('.rama-' + _index);
            this.$arrows = parent.$image_block.find('.arrow-' + _index);
        }

        StvorkaType.prototype.init = function () {
            var self = this;
            this.$submenu_links.on('click', function () {
                var $this = $(this),
                    option_type = $this.data('type');
                self.switchRamas(option_type);
                self.switchArrows(option_type);
                dev_kit.makeItemActive($this);
                $d.trigger('send_settings');
            });

            this.initSpecialLink();
        };

        StvorkaType.prototype.getPosition = function () {
            return this.$submenu_links.filter('.active').data('type');
        };

        StvorkaType.prototype.switchRamas = function (type) {
            (type == 'gluhaya') ? this.$rama.fadeOut(300) : this.$rama.fadeIn(300);
        };

        StvorkaType.prototype.switchArrows = function (type) {
            switch (type) {
                case 'gluhaya':
                {
                    this.$arrows.hide();
                    break;
                }
                case 'povorotnaya':
                {
                    this.$arrows.filter('.arrow-povorotnaya').show();
                    this.$arrows.filter('.arrow-otkidnaya').hide();
                    break;
                }
                case 'otkidnaya':
                {
                    this.$arrows.show();
                    break;
                }
            }
        };

        /*И все это ради включения - отключения второй створки у балконов*/
        StvorkaType.prototype.initSpecialLink = function () {
            if (this.parent.window_type == 'balcony') {
                var picture_sets = this.parent.$image_block.find('.b-balcony-picture-set'),
                    $link_deletefold = this.$el.find('.submenu__item__delete-stvorka'),
                    $text_delete = $link_deletefold.find('.text__delete');

                $link_deletefold.on('click', $.proxy(function () {
                    picture_sets.toggleClass('hide');
                    $text_delete.toggleClass('hide');
                    this.$submenu_links.toggle();
                    this.$el.toggleClass('item_excluded');
                    $d.trigger('send_settings');
                }, this));
            }
        };

        /*Кнопки панель-кирпич*/
        var $pic_blocks = $image_blocks.find('.picture__materials');

        function MaterialsBtns($el) {
            this.$el = $el;
            this.$btns = $el.find('.b-calc__materials__item');
            this.current = 'euroline';
        }

        MaterialsBtns.prototype.init = function () {
            this.bindEvents();
        };

        MaterialsBtns.prototype.bindEvents = function () {
            var self = this;
            $.each(this.$btns, function (i) {
                var $this = $(this),
                    type = $this.data('type'),
                    $my_blocks = $pic_blocks.find('.js-pic-mat-' + type);

                $this.on('click', function () {
                    dev_kit.makeItemActive($this);
                    dev_kit.makeItemActive($my_blocks);
                    self.current = type;
                    $d.trigger('send_settings');
                });
            });
        };

        MaterialsBtns.prototype.getValue = function(){
          return this.current;
        };

        /*Кнопки типа ОТДЕЛКА - откос, отлив, подоконник*/
        function OtdelkaBtns($el) {
            this.$el = $el;
            this.$btns = $el.find('.b-calc__otdelka__item');
            this.current = [];
        }

        OtdelkaBtns.prototype.init = function () {
            this.bindEvents();
        };

        OtdelkaBtns.prototype.bindEvents = function () {
            var self = this;
            $.each(this.$btns, function (i) {
                var $this = $(this),
                    type = $this.data('type'),
                    $my_pics = $pic_blocks.find('.js-pic-mat-' + type);

                $this.on('click', function () {
                    $this.toggleClass('active');
                    $my_pics.toggleClass('active');
                    $d.trigger('send_settings');
                });
            });
        };

        OtdelkaBtns.prototype.getArray = function(){
          var result = [];
            $.each(this.$btns.filter('.active'),function(){
                result.push($(this).data('type'));
            });
            return result;
        };

        /*end определение классов*/

        var menu_windows_links_array = [],
            $d = $(document),
            $size_horizontal = $('#field-horizontal'),
            $size_vertical = $('#field-vertical'),
            materials = new MaterialsBtns($('.b-calc__materials')),
            otdelka = new OtdelkaBtns($('.b-calc__otdelka')),
            $result = $('.b-total__output');

        $.each($menu_windows_links, function (i, el) {
            var obj = new WindowButton($(el));
            obj.init();
            menu_windows_links_array.push(obj);
        });

        materials.init();
        otdelka.init();

        /*Собираем все параметры калькулятора и отправляем в php-файл*/
        $d.on('send_settings', function () {
            var $activeEl = $menu_windows_links.filter('.active'),
                index = $menu_windows_links.index($activeEl),
                set = {
                    sizes: {}
                };

            set.sizes.horizontal = $size_horizontal.val();
            set.sizes.vertical = $size_vertical.val();

            set.material = materials.getValue(); 
            set.otdelka = otdelka.getArray();

            $.extend(set, menu_windows_links_array[index].getSet());


            sendAjax(set);

        });

        var priceList = CALCULATOR_PRICES; // копируем константу, в целях безопасности

        function sendAjax(set) {
            s(set)
            if (!set.sizes.vertical.length) set.sizes = {horizontal:"1500",vertical:"1300"};
            var profile = set.material;
            var win_type = [
                '1-stvorka',
                '2-stvorka',
                '3-stvorka',
                'framuga'
            ].indexOf(set.win_type);
            var pricePerSquare = priceList[profile][win_type];
            var squareClass = function(h,w) {
                this.h = h / 1000;
                this.w = w / 1000;
                this.getPerimeter = function(type) {
                    if(type == "otkos") {
                        return this.h * 2 + this.w;
                    } else {
                        return this.h * 2 + this.w * 2;
                    }
                };
                this.getSquare = function() {
                    return this.w * this.h;
                }
            };
            // montazh logic
            var square = new squareClass(set.sizes.horizontal, set.sizes.vertical);
            var price = pricePerSquare * square.getSquare();
            // otdelka logic
            if (set.otdelka.indexOf('podok') >= 0) {
                price += square.w * priceList['otdelka'][0];
            }
            if (set.otdelka.indexOf('otkos') >= 0) {
                price += square.getPerimeter('otkos') * priceList['otdelka'][1];
            }
            if (set.otdelka.indexOf('otliv') >= 0) {
                price += square.w * priceList['otdelka'][2];
            }
            // stvorki logic
            Object.keys(set.stvorki).forEach(function(prop) {
                var type = set.stvorki[prop];
                if (type == "povorotnaya") {
                    price += priceList.stvorki.otkr;
                } else if (type == "otkidnaya"){
                    price += priceList.stvorki.otkid;
                }
            })
            $result.html(Math.floor(price))

        }
       
        setTimeout(function(){
            $menu_windows_links.filter('.active').trigger('click'); //todo Из-за того все слушатели событий инициализируются позже p.s. привет "архитектору"
        }, 1000);
    })
})(jQuery, window);
(function ($, w) {
    'use strict';

    $(w).load(function () {

        var param_set;

        $.getJSON('/json/sizes_set.json', function (data) {
            param_set = data;

            var $outputs = $('.size-outputs'),
                $d = $(document);
            /*Определение классов*/

            function SlideSize($el, type) {
                this.$el = $el;
                this.type = type;
                this.$field = $outputs.find('#field-' + this.type);
                this.init_range = param_set['1-stvorka'][this.type];
                this.bottom_limit = this.init_range['min'];
            }

            SlideSize.prototype.init = function () {
                var self = this;
                this.$el.slider({
                    step: 10,
                    range: 'min',
                    value: self.init_range['val'],
                    max: self.init_range['max'],
                    animate: true,
                    orientation: this.type,
                    slide: function (event, ui) {
                        if (!self.checkMin(ui.value)) {
                            return false;
                        }

                        ui.handle.setAttribute('data-checked', ui.value);
                        self.$field.val(ui.value);

                    },
                    stop: function () {
                        $d.trigger('send_settings');
                    }
                })
                    .find('.ui-slider-handle')
                    .attr('data-checked', self.init_range.val)
                    .wrap("<div class='ui-handle-helper'></div>");

                this.initField();

            };

            SlideSize.prototype.initField = function () {
                var self = this;
                this.$field.change(function () {
                    var new_value = checkValue($(this).val());
                    self.$el.slider('option', 'value', new_value);
                    $d.trigger('send_settings');
                }).val(this.init_range['val']);

                function checkValue(value) {
                    var result = value;
                    if (!parseInt(value) || value < self.bottom_limit) {
                        result = self.bottom_limit;
                        self.$field.val(result);
                    }
                    if (value > self.init_range['max']) {
                        result = self.init_range['max'];
                        self.$field.val(result);
                    }
                    return result;
                }
            };

            SlideSize.prototype.checkMin = function (val) {
                var self = this,
                    value = val;
                if (val < this.bottom_limit) {
                    value = this.bottom_limit;
                    this.$el.slider('option', 'value', value);
                    this.$field.val(value);
                    startLimitGlow(200);
                    return false;
                } else {
                    this.$el.removeClass('limit-glow');
                }

                return true;

                function startLimitGlow(stop_time) {
                    self.$el.addClass('limit-glow');
                    setTimeout(function () {
                        self.$el.removeClass('limit-glow');
                    }, stop_time)
                }
            };

            SlideSize.prototype.changeRange = function (data) {
                this.bottom_limit = data['min'];
                this.$el.slider('option', {
                    'value': data['val'],
                    'max': data['max']
                });
                this.$field.val(data['val']);
            };

            var $sliders = $('.b-slider'),
                sliders_array = [];

            /*end определение классов*/

            $.each($sliders, function () {
                var $this = $(this),
                    type = $this.data('type'),
                    slider = new SlideSize($this, type);
                slider.init();

                sliders_array.push(slider);
            });

            $d.on('change_slider_val', function (e, data) {
                for (var i = 0; i < sliders_array.length; i++) {
                    var slider = sliders_array[i],
                        type = slider.type,
                        local_params = param_set[data][type];

                    slider.changeRange(local_params);
                }
            });

            //Сразу же и посчитаем
            $d.trigger('send_settings');
        });
    });
})(jQuery, window);