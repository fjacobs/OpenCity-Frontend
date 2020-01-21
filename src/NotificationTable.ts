

export default function initNotificationTable() {

    $(window).on("load", function () {
        // @ts-ignore
        $("#grid").shieldGrid({
            sorting: true,
            dataSource: {
                data: "#data",
                schema: {
                    type: "table",
                    fields: {
                        Id: {type: Number},
                        Name: {type: String},
                        Description: {type: String},
                        Category: {type: Number},
                        Date: {type: Date},
                        Available: {type: Boolean}
                    }
                }
            },
            events: {
                dataBound: gridDataBound
            },
            rowHover: false,
            columns: [
                {field: "Id"},
                {field: "Name"},
                {field: "Description"},
                {field: "Category"},
                {field: "Date"},
                {field: "Available"}
            ]
        });
        setInterval(refreshGird, 2000)

    });

    function refreshGird() {
        // @ts-ignore
        let grid = $("#grid").swidget(),
            initialOptions = grid.initialOptions;
        initialOptions.dataSource = {
            // @ts-ignore
            data: window.gridData
        };
        grid.refresh(initialOptions);
    }

    function gridDataBound(e) {
        var data = e.target.dataSource.view;
        var rows = e.target.contentTable.find(">tbody>tr");
        for (var i = 0; i < data.length; i++) {
            // var item = data[i];
            // if (item.price > 15) {
            //     $(rows[i].cells[3]).addClass("red");
            // }
            // if (item.price < 10) {
            //     $(rows[i].cells[3]).addClass("green");
            // }
            // if (item.year > 2005) {
            //     $(rows[i].cells[1]).addClass("yellow");
            // }
        }
    }
}
