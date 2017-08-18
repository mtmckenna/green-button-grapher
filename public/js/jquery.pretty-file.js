/*******

 jQuery prettyFileInput
 Author: Tom Gordon
 Company: Alaress
 Release: 31/05/2011

 "if ya needs thar a prettier file inputstick tharn come on doooown"

 This changes file inputs to be prettier!
 I started with this basic converter

 http://www.viget.com/inspire/custom-file-inputs-with-a-bit-of-jquery/

 so thanks for that!

 v. 0.1

 + inputHolderClass: this wraps all the appended elements and the file input itself.
 + buttonClass: this is the class for the 'button', the thing underneath the invisible file input. how sneaky!
 + buttonActiveClass: for when a file has been selected.
 + additionalButtonClasses: if you need extra classes on the button whack em in here.
 + fakeFileHolderClass: this is the class for the element that holds the filename like "chimpney.jpg"
 + defaultText: This is the text on the button
 + defaultFileSelectedText: This is the text that the button transforms to.

 *******/

(function($) {
    $.fn.prettyFileInput = function(options) {
        var defaults = {
            inputHolderClass: 'file-input',
            buttonClass: 'btn',
            additionalButtonClasses: 'btn-file-input',
            buttonActiveClass: 'btn-file-input-active',
            fakeFileHolderClass: 'file-holder',
            defaultText: 'Choose file',
            defaultFileSelectedText: 'File selected'

        };
        var options = $.extend(defaults, options);

        return this.each(function() {

            var obj = $(this);

            obj.wrap('<span class="' + options.inputHolderClass + '"></span>');
            obj.after('<span class="' + options.buttonClass + ' ' + options.additionalButtonClasses + '">' + options.defaultText + '</span>');

            obj.bind('change focus click', function() {

                $val = obj.val();

                valArray = $val.split('\\');
                newVal = valArray[valArray.length - 1];
                $button = obj.siblings('.' + options.buttonClass + '');
                $fakeHolder = obj.siblings('.' + options.fakeFileHolderClass + '');

                if (newVal !== '') {
                    $button.addClass(options.buttonActiveClass).html(options.defaultFileSelectedText);
                }

                if ($fakeHolder.length === 0) {
                    obj.parent().append('<span class="'+options.fakeFileHolderClass+'">' + newVal + '</span>');
                } else {
                    $fakeHolder.text(newVal);
                }

                if (($fakeHolder.length > 0) && (newVal === '')) {
                    $fakeHolder.remove();
                    $button.html(options.defaultText).removeClass().addClass(options.buttonClass + ' ' + options.additionalButtonClasses);
                }

            });
        });
    };
})(jQuery);

$('input[type=file]').prettyFileInput();
