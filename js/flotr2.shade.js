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
            grid = options.grid,
            verticalLines = grid.verticalLines,
            horizontalLines = grid.horizontalLines,
            minorVerticalLines = grid.minorVerticalLines,
            minorHorizontalLines = grid.minorHorizontalLines,
            plotHeight = this.plotHeight,
            plotWidth = this.plotWidth,
            a, v, i, j;

            if(verticalLines || minorVerticalLines ||
            horizontalLines || minorHorizontalLines){
                //E.fire(this.el, 'flotr:beforegrid', [this.axes.x, this.axes.y, options, this]);
            }
            ctx.save();
            ctx.lineWidth = 1;
            ctx.strokeStyle = grid.tickColor;

            ctx.fillStyle = 'black';
            //ctx.fillRect(55,55,100,100);
            console.log(options.xaxis.shadeRange[1]);
            var shadeRange = options.xaxis.shadeRange;
            myG = this;
            ctx.translate(this.plotOffset.left, this.plotOffset.top);

            a = this.axes.x;

            for (i = 0; i < shadeRange.length; i++) {
                var pShadeRange = [a.d2p(shadeRange[i][0]),
                    a.d2p(shadeRange[i][1])];
                console.log('shaderange: ' + shadeRange[i]);
                console.log('pshaderange: ' + pShadeRange);
                ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
                ctx.fillRect(pShadeRange[0], 0,
                    pShadeRange[1] - pShadeRange[0], plotHeight);
            }

            ctx.restore();

            if(verticalLines || minorVerticalLines ||
            horizontalLines || minorHorizontalLines){
                //E.fire(this.el, 'flotr:aftergrid', [this.axes.x, this.axes.y, options, this]);
            }
        }
    });

})();
