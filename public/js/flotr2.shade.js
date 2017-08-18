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
            plotOffset = this.plotOffset,
            a, i, shadeRanges, fillColor, fillOpacity;

            // TODO: More robust error checking
            if (!options.xaxis.shade || !options.xaxis.shade.ranges) return;

            //E.fire(this.el, 'flotr:beforeshade', [this.axes.x, this.axes.y, options, this]);

            ctx.save();

            a = this.axes.x;
            shadeRanges = options.xaxis.shade.ranges;
            fillColor = options.xaxis.shade.fillColor || '#838B8B';
            fillOpacity = options.xaxis.shade.fillOpacity || 0.5;

            for (i = 0; i < shadeRanges.length; i++) {
                var pShadeRange =
                [a.d2p(shadeRanges[i][0]) + plotOffset.left,
                 a.d2p(shadeRanges[i][1]) + plotOffset.left];

                ctx.fillStyle = fillColor;
                ctx.globalAlpha = fillOpacity;

                ctx.fillRect(
                pShadeRange[0],
                0 + plotOffset.top,
                pShadeRange[1] - pShadeRange[0],
                plotHeight + plotOffset.top);
            }

            ctx.restore();

            //E.fire(this.el, 'flotr:aftershade', [this.axes.x, this.axes.y, options, this]);
        }
    });
})();
