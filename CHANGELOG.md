
2.0
  - New method of rendering nodes in a div layer instead of old foreignObject inside svg
  - Improved ports offset calculation method
  - Fixed ports continuous updates by using a computed property instead to trigger updates
  - Other - default drag threshold reduced to 2
          - simplified nodes and groups structure (less divs)
          - removed margin from groups and nodes as its no longer needed
          - removed node text select as this can be achieved using CSS
          - fixed edge producing errors if assigned nodes cannot be found

1.4.0
  - Fix safari issues for initial node dimensions and styles demo