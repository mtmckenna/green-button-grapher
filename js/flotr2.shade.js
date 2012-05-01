(function () {

    var E = Flotr.EventAdapter,
    _ = Flotr._;

    Flotr.addPlugin('graphShade', {

        callbacks: {
            'flotr:beforedraw' : function () {
                this.graphShade.drawShade();
            },
            'flotr:afterdraw' : function () {
            }
        },

        drawShade: function(){

            var
            ctx = this.ctx,
            options = this.options,
            plotHeight = this.plotHeight,
            plotWidth = this.plotWidth,
            a, i;

            //E.fire(this.el, 'flotr:beforeshade', [this.axes.x, this.axes.y, options, this]);

            ctx.save();

            var shadeRanges = options.xaxis.shade.ranges;

            a = this.axes.x;

            for (i = 0; i < shadeRanges.length; i++) {
                var pShadeRange = [a.d2p(shadeRanges[i][0]),
                a.d2p(shadeRanges[i][1])];
                ctx.fillStyle = options.xaxis.shade.fillColor;
                ctx.globalAlpha = options.xaxis.shade.fillOpacity;
                ctx.fillRect(pShadeRange[0], 0,
                pShadeRange[1] - pShadeRange[0], plotHeight);
            }

            ctx.restore();

            //E.fire(this.el, 'flotr:aftershade', [this.axes.x, this.axes.y, options, this]);
        }
    });

})();
