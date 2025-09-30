import type { CellContext } from "@tanstack/react-table";

type ScrollTableProps = {
  props: CellContext<any, any>;
  value?: any;
}

export default function ScrollTableData({ props, value }: ScrollTableProps) {
  const rawValue = value !== undefined ? value : props.getValue();

  let content;

  // NOTE: Checks if rawValue is a date string
  if (typeof rawValue === 'string' && rawValue.trim() !== '') {
    const dateObject = new Date(rawValue);

    if (!isNaN(dateObject.getTime())) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      };
      content = new Intl.DateTimeFormat(undefined, options).format(dateObject);
    } else {
      content = rawValue;
    }
  } else if (Array.isArray(rawValue)) {
    let temporary = "";
    for (let i = 0; i < rawValue.length; i++) {
      if (i === 0)
        temporary = rawValue[i];
      else if (i === rawValue.length - 1)
        temporary = `${temporary}, ${rawValue[i]}`;
      else
        temporary = `${temporary}, ${rawValue[i]}, `;
    }
    content = temporary;
  }
  else {
    content = rawValue;
  }
  return (
    <div
      className={`py-2 overflow-x-auto ease-in-out`}
    >
      {content}
    </div>
  )
}
