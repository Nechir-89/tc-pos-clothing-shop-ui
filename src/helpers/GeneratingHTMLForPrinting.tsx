
type Props = {
  columnsToPrint: any,
  rowsToPrint: any,
  beg: any,
  end: any
}

export const generateHtmlForPrinting = ({ columnsToPrint, rowsToPrint, beg, end }: Props) => {
  const tableHeaders = columnsToPrint.map((col: any) => (`<th>${col.label}</th>`)).join('')
  const tableRows = rowsToPrint.map((row: any) => {
    const keys = Object.keys(row);
    // @ts-ignore
    const cells = keys?.map((cell: string) => `<td>${row[cell]}</td>`)
    return (`<tr>${cells.join('')}</tr>`)
  }).join('')

  return (`
    <html>
    <head>
      <title>Print</title>
      <style>
        *{
          padding: 0px;
          margin: 0px;
        }
        p{
          padding: 4px 0px;
          text-align: right;
        }
        table.invoice-items, 
        table.invoice-items tr, 
        table.invoice-items td, 
        table.invoice-items th{
          border: 1px solid black; 
          border-collapse: collapse;
          text-align: right;
        }
        td, th{
          text-align: right;
          padding: 4px;
          line-height: 0.8;
          font-size: 12px;
        }

        section{
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        
        h2{
          text-algin: center;
        }

        div.end-content{
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 4px;
        }

        table.bottom-table td,
        table.bottom-table th{
          font-size: 13px
        }

      </style>
    </head>
    <body>
      <header>
        <h2 style='text-align: center;'>مارکێتا سەرهەلدان</h2>
        <p style='font-size: 12px; text-align: center;'>0750 417 2971 - 0750 376 1655</p>
      </header style='margin-bottom: 1rem;'>
      <section>${beg}</section>
      <section>
        <table class='invoice-items'>
          <thead>
            <tr>${tableHeaders}</tr>
          <thead>
          <tbody >
            ${tableRows}
          </tbody>
        </table>
      </section>
      <section class='end-content' dir='rtl' style='margin-top: 0.5rem;'>${end}</section>
      <p style='font-size: 12px'>تێبینی: پشتی 24 دەمژمێرا زڤراندن یان گوهرین نا هێتە وەرگرتن </p>
    </body>
  </html>
  `);
}
