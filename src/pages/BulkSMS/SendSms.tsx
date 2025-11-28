import { X } from "lucide-react";
import Button from "@/components/Button";
import classNames from "classnames";
import { SendHorizontal } from "lucide-react";
import { TextArea } from "@/components/base/textarea/textarea";

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
        <div className="flex flex-col gap-6 w-full p-0 md:p-6 lg:p-6 bg-none md:bg-white border-0 md:border lg:border border-gray-200 md:shadow-sm lg:shadow-sm rounded-none md:rounded-md">
          {/* Message */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-gray-800">Message</h2>
            <TextArea
              isRequired
              placeholder="Type your message here..."
              rows={8}
            />
          </div>

          {/* Recipients */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium text-gray-800">Recipients</h2>
              <p className="text-xs font-normal text-gray-400">
                Add recipients by searching existing customers, or typing phone
                numbers.
              </p>
            </div>
            <TextArea
              isRequired
              placeholder="Search customers or type numbers..."
              rows={8}
            />
          </div>
        </div>

        {/* Summary */}
        <div className="flex p-5 rounded-md shadow-sm flex-col gap-6 h-auto min-w-2xs bg-white border border-gray-200">
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
