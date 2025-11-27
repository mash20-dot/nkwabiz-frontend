import { X } from "lucide-react";
import Button from "@/components/Button";
import classNames from "classnames";
import { SendHorizontal } from "lucide-react";

type SendSMSProps = {
  showForm: boolean;
  closeForm: () => void;
};

const Summary = ({
  title,
  value,
  className,
  textColor,
}: {
  title: string;
  value: number;
  className?: string;
  textColor?: string;
}) => {
  const style = classNames("flex flex-row w-full justify-between", className);

  return (
    <div className={className ? style : "flex flex-row w-full justify-between"}>
      <span
        className={`font-normal text-sm text-start ${
          textColor ? textColor : "text-gray-600"
        }`}
      >
        {title}
      </span>
      <span
        className={`text-sm font-semibold text-end ${
          textColor ? textColor : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const SendSms = ({ showForm, closeForm }: SendSMSProps) => {
  return (
    <div
      className={
        !showForm ? "hidden" : "flex flex-col items-start justify-center gap-6"
      }
    >
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900">Send Bulk SMS</h1>
          <p className="text-sm font-normal text-gray-600">
            Compose your message and send to multiple recipients.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="cursor-pointer" onClick={closeForm}>
            <X className="h-4 w-4 mr-2 text-gray-600" aria-hidden="true" />
            Close
          </Button>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-6">
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-md"></div>

        {/* Summary */}
        <div className="flex p-5 rounded-md shadow-sm flex-col gap-6 min-w-2xs bg-white border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Cost Summary</h2>
          <div className="flex flex-col gap-4 w-full">
            <Summary title="Cost per SMS" value={0.025} className="justify-" />
            <Summary title="Total Recipients" value={10} />
            <hr className="bg-gray-200" />
            <Summary title="Estimated Cost" value={0.025 * 10} />
            <Summary
              className="bg-blue-100 p-2 rounded-sm"
              textColor="text-blue-600"
              title="Current Balance"
              value={23.5}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer items-center justify-center">
            <SendHorizontal className="h-4 w-4 mr-2 text-white" />
            Send Message
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendSms;
