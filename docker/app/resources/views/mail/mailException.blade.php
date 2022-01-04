<h3>Error information:</h3>
<p><strong>Date:</strong> {{ date('M d, Y H:iA') }}</p>
<p><strong>Message:</strong> {{ $content->getMessage() }}</p>
<p><strong>Code:</strong> {{ $content->getCode() }}</p>
<p><strong>File:</strong> {{ $content->getFile() }}</p>
<p><strong>Line:</strong> {{ $content->getLine() }}</p>
<h3>Stack trace:</h3>
<pre>{{ $content->getTraceAsString() }}</pre>
